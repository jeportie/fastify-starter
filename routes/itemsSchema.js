// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   itemsSchema.js                                     :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/24 12:37:13 by jeportie          #+#    #+#             //
//   Updated: 2025/09/24 12:39:20 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

const Item = {
    type: "object",
    properties: {
        id: { type: "string" },
        name: { type: "string" },
    },
}

export const getItemsSchema = {
    response: {
        200: {
            type: "array",
            items: Item,
        },
    },
};

export const getItemSchema = {
    response: {
        200: Item,
    },
};

export const addItemSchema = {
    body: {
        type: "object",
        required: ["name"],
        properties: {
            name: { type: "string" },
        },
    },
    response: {
        201: Item,
    },
};

export const deleteItemSchema = {
    response: {
        200: {
            type: "object",
            properties: {
                message: { type: "string" },
            }
        },
    },
};

export const updateItemSchema = {
    response: {
        200: Item,
    },
};
