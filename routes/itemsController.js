// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   itemsController.js                                 :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/24 12:10:10 by jeportie          #+#    #+#             //
//   Updated: 2025/09/24 12:36:54 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// Decides what to do with the request and talks to the serivce layer and 
// returns a response

import { items } from "../data/items.js";
import * as services from "./itemsServices.js";

export async function getItems(req, reply) {
    reply.send(services.getAll());
}

export async function getItem(req, reply) {
    const { id } = req.params;
    const item = services.findId(id);
    if (!item) {
        return reply.code(404).send({ message: `Item ${id} not found` });
    }
    reply.send(item);
}

export async function addItem(req, reply) {
    const { name } = req.body;
    const item = services.add(name);
    reply.code(201).send(item);
}

export async function deleteItem(req, reply) {
    const { id } = req.params;
    const deleted = services.remove(id);

    if (!deleted) {
        return reply.code(404).send({ message: `Item ${id} not found` });
    }
    reply.send({ message: `Item ${id} has been removed` });
}

export async function updateItem(req, reply) {
    const { id } = req.params;
    const { name } = req.body;
    const updated = services.update(id, name);

    if (!updated) {
        return reply.code(404).send({ message: `Item ${id} not found` });
    }
    reply.send(updated);
}
