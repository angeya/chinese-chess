package top.angeya.chinses.chess.pojo;

import javax.websocket.Session;

/**
 * @author: Angeya
 * @date: 2022/3/13 13:57
 * @description: 象棋房间
 */
public class Room {
    private Integer roomId;
    private Session redPlayer;
    private Session blackPlayer;

    public Room(Integer roomId) {
        this.roomId = roomId;
    }

    public Integer getRoomId() {
        return roomId;
    }

    public Session getEnemyPlayer(Session session) {
        if (session.equals(this.redPlayer)) {
            return this.blackPlayer;
        }
        return this.redPlayer;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }

    public Session getRedPlayer() {
        return redPlayer;
    }

    public void setRedPlayer(Session redPlayer) {
        this.redPlayer = redPlayer;
    }

    public Session getBlackPlayer() {
        return blackPlayer;
    }

    public void setBlackPlayer(Session blackPlayer) {
        this.blackPlayer = blackPlayer;
    }
}
