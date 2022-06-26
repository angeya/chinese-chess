package top.angeya.chinses.chess.service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import top.angeya.chinses.chess.constant.Constant;
import top.angeya.chinses.chess.constant.MessageTypeEnum;
import top.angeya.chinses.chess.pojo.MessageData;
import top.angeya.chinses.chess.pojo.MoveCoordinate;
import top.angeya.chinses.chess.pojo.Room;

import javax.websocket.Session;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * @author: Angeya
 * @date: 2022/3/21 19:49
 * @description: 处理所有下期的逻辑
 */
@Service
public class ChessService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ChessService.class);

    /**
     * 房间号管理器-原子操作
     */
    private static final AtomicInteger ROOM_ID_MANAGER = new AtomicInteger(1000);
    /**
     * 房间字典，<房间号，房间对象>
     */
    private static final Map<Integer, Room> ROOM_MAP = new HashMap<>();

    @Value("${app.room.max.count}")
    private Integer roomMaxCount;

    /**
     * 创建房间
     * @param session 会话
     */
    public void createRoom(Session session)  throws IOException {
        if (ROOM_MAP.size() >= roomMaxCount) {
            LOGGER.info("Room number was limited in {}, now is {}", roomMaxCount, ROOM_MAP.size());
            return;
        }
        // 创建房间号
        MessageData<Integer> createRoomResData = new MessageData<>(MessageTypeEnum.CREATE_ROOM.getType());
        int roomId = ROOM_ID_MANAGER.incrementAndGet();
        createRoomResData.setData(roomId);
        session.getBasicRemote().sendText(JSON.toJSONString(createRoomResData));
        // 初始化棋盘
        Room room = new Room(roomId);
        ROOM_MAP.put(roomId, room);
        MessageData<String> initResData = new MessageData<>(MessageTypeEnum.INIT.getType());
        initResData.setData(Constant.RED_PLAYER);
        room.setRedPlayer(session);
        session.getBasicRemote().sendText(JSON.toJSONString(initResData));
    }

    /**
     * 加入房间
     * @param session 会话
     * @param jsonObject 请求数据
     */
    public void addRoom(Session session, JSONObject jsonObject)  throws IOException {
        Integer roomId = jsonObject.getInteger(Constant.MESSAGE_DATA);
        Room room = ROOM_MAP.get(roomId);
        if (room != null && room.getBlackPlayer() == null) {
            room.setBlackPlayer(session);
            // 初始化棋盘
            MessageData<String> initResData = new MessageData<>(MessageTypeEnum.INIT.getType());
            initResData.setData(Constant.BLACK_PLAYER);
            session.getBasicRemote().sendText(JSON.toJSONString(initResData));
            this.judgeReadyState(room);
        }
    }

    /**
     * 退出房间
     * @param session 会话
     */
    public void exitRoom(Session session) {
        Set<Map.Entry<Integer, Room>> entrySet = ROOM_MAP.entrySet();
        Integer removeRoomId = null;
        for (Map.Entry<Integer, Room> entry : entrySet) {
            Integer roomId = entry.getKey();
            Room room = entry.getValue();
            Session redPlayer = room.getRedPlayer();
            Session blackPlayer = room.getBlackPlayer();
            if (session.equals(redPlayer)) {
                room.setRedPlayer(null);
                LOGGER.info("{} room red player left", roomId);
//                break;
            } else if (session.equals(blackPlayer)) {
                LOGGER.info("{} room black player left", roomId);
                room.setBlackPlayer(null);
//                break;
            }
            if (room.getRedPlayer() == null && room.getBlackPlayer() == null) {
                removeRoomId = roomId;
                break;
            }
        }
        if (removeRoomId != null) {
            ROOM_MAP.remove(removeRoomId);
            ROOM_ID_MANAGER.decrementAndGet();
            LOGGER.info("{} room was closed by both of players leaving", removeRoomId);
        }

    }

    /**
     * 棋子移动
     * @param session 会话
     * @param jsonObject 移动数据
     */
    public void moveChess(Session session, JSONObject jsonObject) throws IOException {
        MoveCoordinate coordinate = JSON.parseObject(jsonObject.getString(Constant.MESSAGE_DATA), MoveCoordinate.class);
        System.out.println(coordinate);
        MoveCoordinate newCoordinate = new MoveCoordinate();
        newCoordinate.setDestX(8 - coordinate.getDestX());
        newCoordinate.setDestY(9 - coordinate.getDestY());
        newCoordinate.setSrcX(8 - coordinate.getSrcX());
        newCoordinate.setSrcY(9 - coordinate.getSrcY());
        MessageData<MoveCoordinate> responseData = new MessageData<>(MessageTypeEnum.MOVE.getType());
        responseData.setData(newCoordinate);
        Room room = ROOM_MAP.get(coordinate.getRoomId());
        Session enemyPlayer = room.getEnemyPlayer(session);
        enemyPlayer.getBasicRemote().sendText(JSON.toJSONString(responseData));
    }

    /**
     * 判断房间双方在线状态
     * @param room 房间对象
     * @throws IOException json异常
     */
    private void judgeReadyState(Room room) throws IOException {
        if (room.getRedPlayer() != null && room.getBlackPlayer() != null) {
            LOGGER.info("{} 号房间双方已经准备就绪", room.getRoomId());
            MessageData<String> readyResData = new MessageData<>(MessageTypeEnum.READY.getType());
            room.getRedPlayer().getBasicRemote().sendText(JSON.toJSONString(readyResData));
            room.getBlackPlayer().getBasicRemote().sendText(JSON.toJSONString(readyResData));
        }
    }
}
