package top.angeya.chinses.chess.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import top.angeya.chinses.chess.constant.Constant;
import top.angeya.chinses.chess.constant.MessageTypeEnum;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;

/**
 * @author: Angeya
 * @date: 2022/3/13 13:49
 * @description: websocket服务，不是单例模式
 */
@Service
@ServerEndpoint("/webSocket")
public class WebSocketService {

    private static final Logger LOGGER = LoggerFactory.getLogger(WebSocketService.class);

    /**
     * 下棋服务
     */
    private static ChessService chessService;

    @Autowired
    public void setChessService(ChessService cs) {
        chessService = cs;
    }

    @OnOpen
    public void onOpen(Session session) {
        LOGGER.info("Client connected: {}", session);
    }

    @OnClose
    public void onClose(Session session) {
        chessService.exitRoom(session);
        LOGGER.info("Client closed: {}", session);
    }

    @OnMessage
    public void onMessage(Session session, String message){
        LOGGER.info("Receive message: {}", message);
        JSONObject jsonObject = JSON.parseObject(message);
        String type = jsonObject.getString(Constant.MESSAGE_TYPE);
        try {
            switch (MessageTypeEnum.obtainTypeEnum(type)) {
                // 创建房间
                case CREATE_ROOM:
                    chessService.createRoom(session);
                    break;
                // 进入房间
                case ADD_ROOM:
                    chessService.addRoom(session, jsonObject);
                    break;
                // 退出房间
                case EXIT_ROOM:
                    chessService.exitRoom(session);
                    break;
                // 移动棋子
                case MOVE:
                    chessService.moveChess(session, jsonObject);
                    break;
                default:
            }
        } catch (IOException e) {
            LOGGER.error("Message handle failed", e);
        }

    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        LOGGER.warn("There is something wrong", throwable);
    }

}
