export class User {
    readonly id : number
    readonly age : number
    readonly name : string
    constructor(id : number, name : string, age : number ) {
        this.id = id
        this.name = name
        this.age = age
    }
}