class TasksController < ApplicationController
  before_action :set_task, only:[:mark_completed]

  def index
    
  end

  def fetch_tasks
    @tasks = Task.all.order('created_at ASC')
    render json: { tasks: @tasks }
  end

  def mark_completed
    @task.completed = !@task.completed
    if @task.update(task_params)
      render json: { ok: "UPDATE", task: @task}
    else
      render json: { error: "There was an error"}
    end
  end

  def create_task
    @task = Task.new(task_params)
    if @task.save
      @task.created_at = @task.created_at.strftime("%d %m %y")
      @task.updated_at = @task.updated_at.strftime("%d %m %y")
      render json: { ok: "CREATE", task: @task}
    else
      render json: { error: "There was an error"}
    end
  end

  def destroy
    @task = Task.find(params[:id])
    @task.destroy
    render json: { ok: "DELETE" }
  end

  def about

  end

  private

  def task_params
    params.require(:task).permit(:completed, :id, :title, :description)
  end

  def set_task
    @task = Task.find(params[:id])
  end
end
