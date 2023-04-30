class User {
    id
    name
    phone
    availability 

    constructor(data) {
        const {id, name, phone, availability} = data || {}
        this.id = id
        this.name = name
        this.phone = phone
        this.availability = availability // array of date objects
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            phone: this.phone,
            availability: this.availability
        }
    }
}

export {User}