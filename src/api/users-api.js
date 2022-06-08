import {server} from "./auth-api";

export const usersApi = {
    getAll() {
        return server.get("/users")
    },
    getOne(id) {
        return server.get(`/users/${id}`)
    },
    create(user) {
        return server.post("/users", user)
    },
    delete(id) {
        return server.delete(`/users/${id}`)
    },
    update(id, user) {
        return server.put(`/users/${id}`, user)
    },
};
