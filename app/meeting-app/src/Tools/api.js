// eslint-disable-next-line no-unused-vars
import React from 'react'
import axios from 'axios'

export class API {
    static host
    static port
    static path

    static setURL = (host, port, path) => {
        this.url = host
        this.port = port
        this.path = path
    }

    static getBaseURL = () => {
        return this.port 
            ? `${this.url}:${this.port}${this.path}`
            : `${this.url}${this.path}`
    }

    static async get(path) {
        const data = await axios.get(`${this.getBaseURL()}${path}`)
        return data?.data || {}
    }

    static async post(path, body) {
        const data = await axios.post(`${this.getBaseURL()}${path}`, body)
        return data?.data || {}
    }

    static async patch(path, body) {
        const data = await axios.patch(`${this.getBaseURL()}${path}`, body)
        return data?.data || {}
    }

    static async delete(path) {
        const data = await axios.delete(`${this.getBaseURL()}${path}`)
        return data?.data || {}
    }

}