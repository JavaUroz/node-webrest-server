export class CreateTodoDTO {
    private constructor(
        public readonly text: string,
    ){}

    static create(props: Record<string, any>): [string | undefined, CreateTodoDTO | undefined] {
        const { text } = props;

        if(!text || text.length === 0) return ['Text property is required', undefined];

        return[undefined, new CreateTodoDTO(text)];
    }
}