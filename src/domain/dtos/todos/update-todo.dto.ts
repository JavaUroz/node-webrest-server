export class UpdateTodoDTO {
    private constructor(
        public readonly id: number,
        public readonly text?: string,
        public readonly completedAt?: Date,
    ){}

    get values() {
        const returnObj: Record<string, any> = {};

        if(this.text) returnObj.text = this.text;
        if(this.completedAt) returnObj.CompletedAt = this.completedAt;

        return returnObj;
    }

    static create(props: Record<string, any>): [string | undefined, UpdateTodoDTO | undefined] {
        const { id, text, completedAt } = props;

        if(!id || isNaN(Number(id))) {
            return ['id must be a valid number', undefined]
        } 

        let newCompletedAt = completedAt;

        if(completedAt) {
            newCompletedAt = new Date(completedAt)
            if(newCompletedAt.toString() === 'Invalid Date') {
                return ['CompletedAt must be a valid date', undefined]
            }
        }



        return[undefined, new UpdateTodoDTO(id, text, newCompletedAt)];
    }
}