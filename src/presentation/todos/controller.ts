import { Response, Request } from "express";
import { CreateTodoDTO, UpdateTodoDTO } from "../../domain/dtos";
import { CreateTodo, DeleteTodo, GetAllTodo, GetTodo, TodoRepository, UpdateTodo } from "../../domain";

export class TodosController {
    //*DI
    constructor(
        private readonly todoRepository: TodoRepository,
    ) {}

    public getTodos = (req: Request, res: Response) => {
        new GetAllTodo(this.todoRepository)
            .execute()
            .then(todos => res.json(todos))
            .catch(error => res.status(400).json({ error }));
    }

    public getTodoById = (req: Request<{ id: string }>, res: Response) => {
        const id = +req.params.id;
        
        new GetTodo(this.todoRepository)
            .execute(id)
            .then(todo => res.json(todo))
            .catch(error => res.status(400).json({ error }));
    };

    public createTodo = (req: Request, res: Response) => {
        const [error, createTodoDTO] = CreateTodoDTO.create(req.body);

        if(error) return res.status(400).json({ error });

        new CreateTodo(this.todoRepository)
            .execute(createTodoDTO!)
            .then(todo => res.json(todo))
            .catch(error => res.status(400).json({ error }));
    };

    public updateTodo = (req: Request<{ id: string }>, res: Response) => {
        const id = +req.params.id;
        const [error, updateTodoDTO] = UpdateTodoDTO.create({...req.body, id})
        if(error) return res.status(400).json({ error });

        new UpdateTodo(this.todoRepository)
            .execute(updateTodoDTO!)
            .then(todo => res.json(todo))
            .catch(error => res.status(400).json({ error }));
    };

    public deleteTodo = (req: Request<{ id: string }>, res: Response) => {
        const id = +req.params.id;
        
        new DeleteTodo(this.todoRepository)
            .execute(id)
            .then(todo => res.json(todo))
            .catch(error => res.status(400).json({ error }));
    };
}