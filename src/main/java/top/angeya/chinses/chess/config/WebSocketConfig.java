package top.angeya.chinses.chess.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

/**
 * @author: Angeya
 * @date: 2022/3/13 13:47
 * @description:
 */
@Configuration
public class WebSocketConfig {
    /**
     * ServerEndpointExporter
     * 这个Bean会自动注册使用@ServerEndpoint注解声明的websocket endpoint
     */
    @Bean
    public ServerEndpointExporter serverEndpointExporter() {
        return new ServerEndpointExporter();
    }
}
