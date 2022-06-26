package top.angeya.chinses.chess.pojo;

/**
 * @author: Angeya
 * @date: 2022/3/19 20:20
 * @description: 棋子移动坐标数据
 */

public class MoveCoordinate {
    private Integer roomId;
    private Integer destX;
    private Integer destY;
    private Integer srcX;
    private Integer srcY;

    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }

    public Integer getDestX() {
        return destX;
    }

    public void setDestX(Integer destX) {
        this.destX = destX;
    }

    public Integer getDestY() {
        return destY;
    }

    public void setDestY(Integer destY) {
        this.destY = destY;
    }

    public Integer getSrcX() {
        return srcX;
    }

    public void setSrcX(Integer srcX) {
        this.srcX = srcX;
    }

    public Integer getSrcY() {
        return srcY;
    }

    public void setSrcY(Integer srcY) {
        this.srcY = srcY;
    }

    @Override
    public String toString() {
        return "MoveCoordinate{" +
                "destX=" + destX +
                ", destY=" + destY +
                ", srcX=" + srcX +
                ", srcY=" + srcY +
                '}';
    }
}
