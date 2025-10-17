import { UpdateTodoDTO } from "../../dtos";
import { TodoEntity } from "../../entities/todo.entity";
import { TodoRepository } from "../../repositories/todo.repository";


export interface UpdateTodoUseCase {
    execute(dto: UpdateTodoDTO): Promise<TodoEntity>
}

export class UpdateTodo implements UpdateTodoUseCase {
    constructor(
        private readonly repository: TodoRepository,
    ) {}

    execute(dto: UpdateTodoDTO): Promise<TodoEntity> {
        return this.repository.updateById(dto);
    }

}