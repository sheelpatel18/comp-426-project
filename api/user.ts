export class User {
    id: string
    name: string
    phone: string
    availability: Date[]

    constructor({ id, name, phone, availability}: {id: string, name: string, phone: string, availability: Date[]}) {
        this.id = id
        this.name = name
        this.phone = phone
        this.availability = availability
    }

}