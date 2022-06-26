/**
 * 房间管理
 */

/**
 * 创建房间
 * @param roomId 房间号
 */
function initRoomData(roomId) {
    localStorage.setItem(Constant.ROOM_ID, roomId)
    showRoomIdEle.innerText = Constant.TIP_ROOM_ID + roomId
    createRoomEle.style.display = Constant.NONE
    inputRoomIdEle.style.display = Constant.NONE
    addToRoomEle.style.display = Constant.NONE
    exitRoomEle.style.display = Constant.BLOCK
}

/**
 * 加入房间
 */
function addToRoom() {
    const roomId = inputRoomIdEle.value
    const reqData = new RequestData(Constant.ADD_ROOM, roomId)
    connection.send(JSON.stringify(reqData))
}

/**
 * 退出房间
 */
function exitRoom () {
    const reqData = new RequestData(Constant.EXIT_ROOM, null)
    connection.send(JSON.stringify(reqData))
    localStorage.setItem(Constant.ROOM_ID, null)
    showRoomIdEle.innerText = ''
    createRoomEle.style.display = Constant.BLOCK
    inputRoomIdEle.style.display = Constant.BLOCK
    addToRoomEle.style.display = Constant.BLOCK
    exitRoomEle.style.display = Constant.NONE
    chessboard.closeBoard()
    // chessboard = null
    console.log(chessboard)
}