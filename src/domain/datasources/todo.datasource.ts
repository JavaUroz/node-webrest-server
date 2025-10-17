import { CreateTodoDTO, UpdateTodoDTO } from "../dtos";
import { TodoEntity } from "../entities/todo.entity";


export abstract class TodoDatasource {
    abstract create(createTodoDTO: CreateTodoDTO): Promise<TodoEntity>;
    abstract getAll(): Promise<TodoEntity[]>;
    abstract findById(id: number): Promise<TodoEntity>;
    abstract updateById(updateTodoDTO: UpdateTodoDTO): Promise<TodoEntity>;
    abstract deleteById(id: number): Promise<TodoEntity>;
}