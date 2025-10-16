import { Response, Request } from "express";
import { prisma } from "../../data/postgres";

export class TodosController {
    //*DI
    constructor() {}

    public getTodos = async(req: Request, res: Response) => {
        const todos = await prisma.todo.findMany();
        return res.json(todos)
    }

    public getTodoById = async(req: Request<{ id: string }>, res: Response) => {
        const id = +req.params.id;
        if(isNaN(id)) return res.status(400).json({ error: 'ID argument is not a number' });

        const todo = await prisma.todo.findFirst({
            where: { id }
        });

        (!todo)
            ? res.status(404).json({ error: `TODO with id: ${id} not found` })
            : res.json(todo);
    };

    public createTodo = async(req: Request, res: Response) => {
        const { text } = req.body;
        if(!text) return res.status(400).json({ error: 'Text property is required' });

        const newTodo = await prisma.todo.create({
            data: { text }
        });

        res.json(newTodo);
    };

    public updateTodo = async(req: Request<{ id: string }>, res: Response) => {
        const id = +req.params.id;
        if(isNaN(id)) return res.status(400).json({ error: 'ID argument is not a number' });

        const todo = await prisma.todo.findFirst({
            where: { id }
        });

        if(!todo) return res.status(404).json({ error: `TODO with id: ${id} not found` });

        const { text, completedAt } = req.body;
        
        const updateTodo = prisma.todo.update({
            where: { id },
            data: { 
                text,
                completedAt: (completedAt) ? new Date(completedAt) : null
            }
        });

        res.json(updateTodo);
    };

    public deleteTodo = async(req: Request<{ id: string }>, res: Response) => {
        const id = +req.params.id;
        if(isNaN(id)) return res.status(400).json({ error: 'ID argument is not a number' });

        const todo = await prisma.todo.findFirst({
            where: { id }
        });

        if(!todo) return res.status(404).json({ error: `TODO with id: ${id} not found` });

        const deleted = await prisma.todo.delete({
            where :{ id }
        });

        (deleted)
            ? res.json(deleted)
            : res.status(400).json({ error: `TODO with id: ${id} has not been deleted` });
    };
}