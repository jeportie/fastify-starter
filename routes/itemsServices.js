// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   itemsServices.js                                   :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/24 12:28:12 by jeportie          #+#    #+#             //
//   Updated: 2025/09/24 12:32:44 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// Services = Pure business logic (DB, crypto, external API's...)

import { items } from "../data/items.js";
import { v4 as uuidv4 } from "uuid";

// Return all items
export function getAll() {
    return items;
}

// Find by id
export function findId(id) {
    return items.find((item) => item.id === id);
}

// Add a new item
export function add(name) {
    const item = { id: uuidv4(), name };
    items.push(item);
    return item;
}

// Delete an item by id
export function remove(id) {
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    return items.splice(index, 1)[0]; // returns the deleted item
}

// Update an item by id
export function update(id, name) {
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;

    items[index].name = name;
    return items[index];
}
