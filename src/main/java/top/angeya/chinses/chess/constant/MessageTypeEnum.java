package top.angeya.chinses.chess.constant;

/**
 * @author: Angeya
 * @date: 2022/3/19 21:24
 * @description: websocket消息类型
 */
public enum MessageTypeEnum {

    /**
     * 创建房间
     */
    CREATE_ROOM("create_room"),
    /**
     * 加入房间
     */
    ADD_ROOM("add_room"),
    /**
     * 退出房间
     */
    EXIT_ROOM("exit_room"),
    /**
     * 连接初始化
     */
    INIT("init"),
    /**
     * 准备就绪
     */
    READY("ready"),
    /**
     * 移动棋子
     */
    MOVE("move"),
    /**
     * 其他
     */
    OTHER("other"),
    ;

    private String type;

    MessageTypeEnum(String type) {
        this.type = type;
    }


    /**
     * 根据字符串获取类型枚举
     * @param type 类型字符串
     * @return 类型美剧
     */
    public static MessageTypeEnum obtainTypeEnum(String type) {
        for (MessageTypeEnum typeEnum : MessageTypeEnum.values()) {
            if (typeEnum.getType().equals(type)) {
                return typeEnum;
            }
        }
        return MessageTypeEnum.OTHER;
    }

    public String getType() {
        return type;
    }
}
