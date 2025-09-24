// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   itemsHandler.js                                    :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/24 11:53:12 by jeportie          #+#    #+#             //
//   Updated: 2025/09/24 12:40:33 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

// Fastify plugin definitions that handle items routes

import * as controller from "./itemsController.js";
import * as schema from "./itemsSchema.js";

export async function itemRoutes(fastify, options) {
    // Get all items
    fastify.route({
        method: "GET",
        url: "/items",
        schema: schema.getItemsSchema,
        handler: controller.getItems
    });

    // Get single item
    fastify.get("/items/:id", { schema: schema.getItemSchema }, controller.getItem);
    // Add item
    fastify.post("/items", { schema: schema.addItemSchema }, controller.addItem);
    // Delete item
    fastify.delete("/items/:id", { schema: schema.deleteItemSchema }, controller.deleteItem);
    // Update item
    fastify.put("/items/:id", { schema: schema.updateItemSchema }, controller.updateItem);
}
