// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   app.js                                             :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/24 17:06:43 by jeportie          #+#    #+#             //
//   Updated: 2025/09/24 17:12:53 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import Fastify from "fastify";
import swagger from "@fastify/swagger";
import { itemRoutes } from "./routes/itemsHandler.js";

export async function buildApp() {

    const fastify = Fastify({ logger: true });

    // Register swagger with UI enabled
    await fastify.register(swagger, {
        mode: "dynamic", // or "static" if you want pre-defined schemas
        openapi: {
            info: {
                title: "Items API",
                description: "API documentation for items",
                version: "1.0.0",
            },
        },
        exposeRoute: true,      // <── serves both spec + UI
        routePrefix: "/docs",   // <── where to mount it
        staticCSP: false,
    });

    await fastify.register(itemRoutes);
    return (fastify);
}
