// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   server.js                                          :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: jeportie <jeportie@42.fr>                  +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2025/09/24 10:48:50 by jeportie          #+#    #+#             //
//   Updated: 2025/09/24 17:13:03 by jeportie         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

import { buildApp } from "./app.js";
import "dotenv/config"

const fastify = await buildApp();

const fastifyOpts = {
    port: process.env.PORT || 5000,
    host: process.env.HOST || "0.0.0.0",
}

const start = async () => {
    try {
        fastify.listen(fastifyOpts);
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
};

start();
