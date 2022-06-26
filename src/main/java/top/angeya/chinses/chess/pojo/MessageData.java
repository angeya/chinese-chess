package top.angeya.chinses.chess.pojo;

/**
 * @author: Angeya
 * @date: 2022/3/19 20:19
 * @description: Websocket消息体
 */
public class MessageData<T> {

    public MessageData(String type) {
        this.type = type;
    }

    private String type;

    private String color;

    private T data;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
