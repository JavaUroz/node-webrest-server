import { CreateTodoDTO, TodoDatasource, TodoEntity, TodoRepository, UpdateTodoDTO } from "../../domain";

export class TodoRepositoryImpl implements TodoRepository {
    constructor(
        private readonly datasource: TodoDatasource
    ) {}

    create(createTodoDTO: CreateTodoDTO): Promise<TodoEntity> {
        return this.datasource.create(createTodoDTO);
    }

    getAll(): Promise<TodoEntity[]> {
        return this.datasource.getAll();
    }

    findById(id: number): Promise<TodoEntity> {
        return this.datasource.findById(id);
    }

    updateById(updateTodoDTO: UpdateTodoDTO): Promise<TodoEntity> {
        return this.datasource.updateById(updateTodoDTO);
    }

    deleteById(id: number): Promise<TodoEntity> {
        return this.datasource.deleteById(id);
    }

}