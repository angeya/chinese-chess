function Chessboard() {
    this.myColor = undefined
    this.enemyColor = undefined
    this.bothReady = false // 控制双人是否准备好
    this.iGo = true // 控制哪一方走棋
    this.boardElement = document.getElementById('board')
    this.tipElement = document.getElementById('tip')
    // 十行九列
    this.row = 10
    this.col = 9
    this.board = new Array(this.row)
    this.chessWidth = 50
    this.canGoPintWidth = 30
    this.trackPointWidth = 30
    this.boradDom = `
    <!-- 十行 -->
    <div class="rows">
        <div class="row"></div>
        <div class="row"></div>
        <div class="row"></div>
        <div class="row"></div>
        <div class="row"></div>
        <div class="row"></div>
        <div class="row"></div>
        <div class="row"></div>
        <div class="row"></div>
        <div class="row"></div>
    </div>
    <!-- 九列 -->
    <div class="cols">
        <div class="col"></div>
        <div class="col"></div>
        <div class="col"></div>
        <div class="col"></div>
        <div class="col"></div>
        <div class="col"></div>
        <div class="col"></div>
        <div class="col"></div>
        <div class="col"></div>
    </div>
    <!--  中间边界  -->
    <div class="boundary">
        <div class="boundary-text">楚河</div>
        <div class="boundary-text">汉界</div>
    </div>
    <!--  九宫格斜线  -->
    <div class="diagonal line-left-up">
    </div>
    <div class="diagonal line-right-up">
    </div>
    <div class="diagonal line-left-down">
    </div>
    <div class="diagonal line-right-down">
    </div>
    `
    let createBoard = () => {
        for (let i = 0; i < this.board.length; i++) {
            this.board[i] = new Array(this.col)
        }
    }
    createBoard()
}

/**
 * 处理棋盘相关websocket消息
 * @param resData
 */
Chessboard.prototype.handleMsg = function (resData) {
    switch (resData.type) {
        case 'init':
            // 由服务器判断初始化的颜色
            this.myColor = resData.data
            this.enemyColor = this.getEnemyColor(this.myColor)
            this.tipElement.innerText = `${Constant.TIP_READY_WAIT}${this.enemyColor}${Constant.TIP_ONLINE}`
            if (roomId === null) {
                roomId = inputRoomIdEle.value
            }
            initRoomData(roomId)
            this.init()
            this.drawBoard()
            break
        case 'ready':
            // 双方准备就绪
            this.bothReady = true
            this.tipElement.innerText = '双方都上线了，红方先行'
            break
        case 'move':
            // 移动棋子
            let moveCoordinate = resData.data
            this.iGo = true
            this.tipElement.innerText = `${this.myColor}${Constant.TIP_NOW_GO}`
            this.moveChess(moveCoordinate)
            console.log(moveCoordinate)
            break
        case 'wait':
            // 等待双方上线
            this.tipElement.innerText = Constant.TIP_WAIT
            break
    }
}
/**
 * 获取敌方颜色
 */
Chessboard.prototype.getEnemyColor = function () {
    return this.myColor === Constant.RED ? Constant.BLACK : Constant.RED
}
/**
 * 初始化棋盘
 */
Chessboard.prototype.init = function () {
    let mainColor = this.myColor
    let color = this.enemyColor
    const row = mainColor === Constant.RED ? 9 : 0
    const upRow1 = Math.abs(row - 9)
    const upRow2 = Math.abs(row - 7)
    const upRow3 = Math.abs(row - 6)

    const downRow1 = Math.abs(row - 3)
    const downRow2 = Math.abs(row - 2)
    const downRow3 = Math.abs(row - 0)

    if (row === 0) { // if change the side, the color should be changed
        let temp = color
        color = mainColor
        mainColor = temp
    }

    // 黑
    this.board[upRow1][0] = new Chess('车', color)
    this.board[upRow1][1] = new Chess('马', color)
    this.board[upRow1][2] = new Chess('象', color, upRow1)
    this.board[upRow1][3] = new Chess('仕', color)
    this.board[upRow1][4] = new Chess('帥', color)
    this.board[upRow1][5] = new Chess('仕', color)
    this.board[upRow1][6] = new Chess('象', color, upRow1)
    this.board[upRow1][7] = new Chess('马', color)
    this.board[upRow1][8] = new Chess('车', color)

    this.board[upRow2][1] = new Chess('炮', color)
    this.board[upRow2][7] = new Chess('炮', color)

    this.board[upRow3][0] = new Chess('兵', color, upRow3)
    this.board[upRow3][2] = new Chess('兵', color, upRow3)
    this.board[upRow3][4] = new Chess('兵', color, upRow3)
    this.board[upRow3][6] = new Chess('兵', color, upRow3)
    this.board[upRow3][8] = new Chess('兵', color, upRow3)

    // 红
    this.board[downRow1][0] = new Chess('卒', mainColor, downRow1)
    this.board[downRow1][2] = new Chess('卒', mainColor, downRow1)
    this.board[downRow1][4] = new Chess('卒', mainColor, downRow1)
    this.board[downRow1][6] = new Chess('卒', mainColor, downRow1)
    this.board[downRow1][8] = new Chess('卒', mainColor, downRow1)

    this.board[downRow2][1] = new Chess('炮', mainColor)
    this.board[downRow2][7] = new Chess('炮', mainColor)

    this.board[downRow3][0] = new Chess('车', mainColor)
    this.board[downRow3][1] = new Chess('马', mainColor)
    this.board[downRow3][2] = new Chess('相', mainColor, downRow3)
    this.board[downRow3][3] = new Chess('仕', mainColor)
    this.board[downRow3][4] = new Chess('将', mainColor)
    this.board[downRow3][5] = new Chess('仕', mainColor)
    this.board[downRow3][6] = new Chess('相', mainColor, downRow3)
    this.board[downRow3][7] = new Chess('马', mainColor)
    this.board[downRow3][8] = new Chess('车', mainColor)

    this.boardElement.innerHTML = this.boradDom
}
/**
 * 画棋盘
 */
Chessboard.prototype.drawBoard = function () {
    for (let i = 0; i < this.board.length; i++) {
        for (let j = 0; j < this.board[i].length; j++) {
            let chess = this.board[i][j]
            if (chess !== undefined) {
                this.drawChess(chess, i, j)
            }
        }
    }
}
/**
 * 根据棋子大小和中心点获取画棋子的纵坐标
 * @param y
 * @param height
 * @returns {string}
 */
Chessboard.prototype.getTop = function (y, height) {
    return y * 60 + 31 - height / 2 + 'px'
}
/**
 * 根据棋子大小和中心点获取画棋子的横坐标
 * @param x
 * @param width
 * @returns {string}
 */
Chessboard.prototype.getLeft = function (x, width) {
    return x * 60 + 31 - width / 2 + 'px'
}
/**
 * 画新棋子并添加事件监听
 * @param chess
 * @param y
 * @param x
 */
Chessboard.prototype.drawChess = function (chess, y, x) {
    let name = chess.name
    let type = chess.type
    let top = this.getTop(y, this.chessWidth)
    let left = this.getLeft(x, this.chessWidth)
    let color = type === Constant.RED ? 'red' : 'black'
    let chessElement = document.createElement('div')
    chessElement.className = `chess ${color}`
    chessElement.id = `chess${y}${x}`
    chessElement.innerText = name
    chessElement.style.top = top
    chessElement.style.left = left
    if (type === this.myColor) { // you can just move your chess
        chessElement.addEventListener('click', () => {
            // when both are ready
            if (this.bothReady) {
                this.whereToGo(y, x)
            }
        }, false)
    }
    this.boardElement.appendChild(chessElement)
}
/**
 * 根据棋子确定走法
 * @param y
 * @param x
 */
Chessboard.prototype.whereToGo = function (y, x) {
    let point = this.board[y][x]
    switch (point.name) {
        case '车':
            this.cheGo(y, x)
            break
        case '马':
            this.maGo(y, x)
            break
        case '相':
        case '象':
            this.xiangGo(y, x)
            break
        case '仕':
        case '士':
            this.shiGo(y, x)
            break
        case '将':
        case '帥':
            this.jiangGo(y, x)
            break
        case '炮':
            this.paoGo(y, x)
            break
        case '兵':
        case '卒':
            this.bingGo(y, x)
            break
        default:
            console.warn('此点没有棋子')

    }
}
/**
 * 画棋子可以走的提示点并添加时间监听
 * @param pointList
 * @param srcY
 * @param srcX
 */
Chessboard.prototype.drawCanGoPoint = function (pointList, srcY, srcX) {
    this.removeCanGoPoint()
    pointList.forEach(item => {
        const destY = item[0]
        const destX = item[1]
        let top = this.getTop(destY, this.canGoPintWidth)
        let left = this.getLeft(destX, this.canGoPintWidth)
        let chessElement = document.createElement('div')
        chessElement.className = `can-go-point`
        chessElement.style.top = top
        chessElement.style.left = left
        chessElement.addEventListener('click', () => {
            // 如果不是我走棋，不响应
            if (!this.iGo) {
                this.tipBlink()
                return
            }
            this.iGo = false
            this.tipElement.innerText = `${this.enemyColor}${Constant.TIP_NOW_GO}`
            const moveCoordinate = {
                roomId,
                destX,
                destY,
                srcX,
                srcY
            }
            const moveData = { // 可走移动点的坐标，原坐标
                type: 'move',
                data: moveCoordinate
            }
            connection.send(JSON.stringify(moveData))
            this.moveChess(moveCoordinate)
        }, false)
        this.boardElement.appendChild(chessElement)
    })
}
/**
 * 移除所有可以走的提示点
 */
Chessboard.prototype.removeCanGoPoint = function () {
    const lastPointList = document.getElementsByClassName('can-go-point')
    // remove last points
    while (lastPointList.length !== 0) {
        this.boardElement.removeChild(lastPointList[0])
    }
}
/**
 * 移动棋子（删除旧棋子，画新棋子）
 * @param moveCoordinate 移动的相关坐标
 */
Chessboard.prototype.moveChess = function (moveCoordinate) {
    this.removeCanGoPoint()
    this.removeTrackPoint()
    const chess = this.board[moveCoordinate.srcY][moveCoordinate.srcX]
    if (this.board[moveCoordinate.destY][moveCoordinate.destX] !== undefined) {
        this.boardElement.removeChild(
            document.getElementById(`chess${moveCoordinate.destY}${moveCoordinate.destX}`))
    }
    this.drawChess(chess, moveCoordinate.destY, moveCoordinate.destX)
    this.boardElement.removeChild(
        document.getElementById(`chess${moveCoordinate.srcY}${moveCoordinate.srcX}`))
    // 处理坐标数据
    this.board[moveCoordinate.destY][moveCoordinate.destX] = chess
    this.board[moveCoordinate.srcY][moveCoordinate.srcX] = undefined
    // 画移动轨迹 （两个点）
    this.drawChessMoveTrack(moveCoordinate.destY, moveCoordinate.destX)
    this.drawChessMoveTrack(moveCoordinate.srcY, moveCoordinate.srcX)
}
/**
 * 画棋子移动轨迹
 */
Chessboard.prototype.drawChessMoveTrack = function (y, x) {
    let top = this.getTop(y, this.trackPointWidth)
    let left = this.getLeft(x, this.trackPointWidth)
    let chessElement = document.createElement('div')
    chessElement.className = `move-track`
    chessElement.style.top = top
    chessElement.style.left = left
    this.boardElement.appendChild(chessElement)
}
/**
 * 删除轨迹
 */
Chessboard.prototype.removeTrackPoint = function () {
    const lastPointList = document.getElementsByClassName('move-track')
    // remove last points
    while (lastPointList.length !== 0) {
        this.boardElement.removeChild(lastPointList[0])
    }
}
/**
 * 是否在棋盘范围之内
 * @param y
 * @param x
 * @returns {boolean}
 */
Chessboard.prototype.isInBoundary = function (y, x) {
    return this.isInX(x) && this.isInY(y)
}
/**
 * 是否在横坐标范围
 * @param x
 * @returns {boolean}
 */
Chessboard.prototype.isInX = function (x) {
    return this.col - 1 >= x && x >= 0
}
/**
 * 是否在纵坐标之内
 * @param y
 * @returns {boolean}
 */
Chessboard.prototype.isInY = function (y) {
    return this.row - 1 >= y && y >= 0
}
/**
 * 是否在九宮之內
 * @param y
 * @param x
 * @returns {false|*|boolean}
 */
Chessboard.prototype.isInGong = function (y, x) {
    return x >= 3 && x <= 5 && this.isInY(y) && (y <= 2 || y >= 7)
}
/**
 * 車的走法
 * @param y
 * @param x
 */
Chessboard.prototype.cheGo = function (y, x) {
    const thisPoint = this.board[y][x]
    let pointList = [] // points where this chess can go
    console.info('車可以走的点')
    let upY = y
    let downY = y
    let leftX = x
    let rightX = x
    console.log('上')
    while (0 < upY) {
        upY--
        let point = this.board[upY][x]
        if (point === undefined) {
            pointList.push([upY, x])
            console.log(upY, x)
        } else {
            if (point.type !== thisPoint.type) {
                pointList.push([upY, x])
                console.log(upY, x)
            }
            break
        }
    }
    console.log('下')
    while (this.board.length - 1 > downY) {
        downY++
        let point = this.board[downY][x]
        if (point === undefined) {
            pointList.push([downY, x])
            console.log(downY, x)
        } else {
            if (point.type !== thisPoint.type) {
                pointList.push([downY, x])
                console.log(downY, x)
            }
            break
        }
    }
    console.log('左')
    while (0 < leftX) {
        leftX--
        let point = this.board[y][leftX]
        if (point === undefined) {
            pointList.push([y, leftX])
            console.log(y, leftX)
        } else {
            if (point.type !== thisPoint.type) {
                pointList.push([y, leftX])
                console.log(y, leftX)
            }
            break
        }
    }
    console.log('右')
    while (this.board[0].length - 1 > rightX) {
        rightX++
        let point = this.board[y][rightX]
        if (point === undefined) {
            pointList.push([y, rightX])
            console.log(y, rightX)
        } else {
            if (point.type !== thisPoint.type) {
                pointList.push([y, rightX])
                console.log(y, rightX)
            }
            break
        }
    }
    this.drawCanGoPoint(pointList, y, x)
}
/**
 * 馬的走法
 * @param y
 * @param x
 */
Chessboard.prototype.maGo = function (y, x) {
    console.info('马可以走的点')
    const thisPoint = this.board[y][x]
    let pointList = [] // points where this chess can go
    console.log('上')
    // 边界和蹩脚判断
    if (this.isInY(y - 2) && this.board[y - 1][x] === undefined) {
        // 左边
        if (this.isInX(x - 1)) {
            let point = this.board[y - 2][x - 1]
            if (point === undefined || point.type !== thisPoint.type) {
                pointList.push([y - 2, x - 1])
                console.log(y - 2, x - 1)
            }
        }
        // 右边
        if (this.isInX(x + 1)) {
            let point = this.board[y - 2][x + 1]
            if (point === undefined || point.type !== thisPoint.type) {
                pointList.push([y - 2, x + 1])
                console.log(y - 2, x + 1)
            }
        }
    }
    console.log('下')
    if (this.isInY(y + 2) && this.board[y + 1][x] === undefined) {
        // 左边
        if (this.isInX(x - 1)) {
            let point = this.board[y + 2][x - 1]
            if (point === undefined || point.type !== thisPoint.type) {
                pointList.push([y + 2, x - 1])
                console.log(y + 2, x - 1)
            }
        }
        // 右边
        if (this.isInX(x + 1)) {
            let point = this.board[y + 2][x + 1]
            if (point === undefined || point.type !== thisPoint.type) {
                pointList.push([y + 2, x + 1])
                console.log(y + 2, x + 1)
            }
        }
    }
    console.log('左')
    if (this.isInX(x - 2) && this.board[y][x - 1] === undefined) {
        // 上边
        if (y - 1 >= 0) {
            let point = this.board[y - 1][x - 2]
            if (point === undefined || point.type !== thisPoint.type) {
                pointList.push([y - 1, x - 2])
                console.log(y - 1, x - 2)
            }
        }
        // 下边
        if (y + 1 < this.board.length) {
            let point = this.board[y + 1][x - 2]
            if (point === undefined || point.type !== thisPoint.type) {
                pointList.push([y + 1, x - 2])
                console.log(y + 1, x - 2)
            }
        }
    }
    console.log('右')
    if (this.isInX(x + 2) && this.board[y][x + 1] === undefined) {
        // 上边
        if (y - 1 >= 0) {
            let point = this.board[y - 1][x + 2]
            if (point === undefined || point.type !== thisPoint.type) {
                pointList.push([y - 1, x + 2])
                console.log(y - 1, x + 2)
            }
        }
        // 下边
        if (y + 1 < this.board.length) {
            let point = this.board[y + 1][x + 2]
            if (point === undefined || point.type !== thisPoint.type) {
                pointList.push([y + 1, x + 2])
                console.log(y + 1, x + 2)
            }
        }
    }
    this.drawCanGoPoint(pointList, y, x)
}
/**
 * 相、象的走法
 * @param y
 * @param x
 */
Chessboard.prototype.xiangGo = function (y, x) {
    const thisPoint = this.board[y][x]
    let pointList = [] // points where this chess can go
    // just need to judge four points
    let x1 = x - 2
    let x2 = x + 2
    let y1 = y - 2
    let y2 = y + 2

    let xiangGoPoint = (tempY, tempX) => {
        const centerY = (tempY + y) / 2
        const centerX = (tempX + x) / 2
        if (this.isInBoundary(tempY, tempX) &&
            (this.board[tempY][tempX] === undefined || this.board[tempY][tempX].type !== thisPoint.type) &&
            this.board[centerY][centerX] === undefined &&
            (thisPoint.isGoUp && tempY >= 5 || !thisPoint.isGoUp && tempY <= 4)) {
            pointList.push([tempY, tempX])
        }
    }
    xiangGoPoint(y1, x1)
    xiangGoPoint(y1, x2)
    xiangGoPoint(y2, x1)
    xiangGoPoint(y2, x2)
    this.drawCanGoPoint(pointList, y, x)
}
/**
 * 炮的走法
 * @param y
 * @param x
 */
Chessboard.prototype.paoGo = function (y, x) {
    const thisPoint = this.board[y][x]
    let pointList = [] // points where this chess can go

    console.info('炮可以走的点')
    let isJumped = false
    let upY = y
    let downY = y
    let leftX = x
    let rightX = x

    let paoGoPoint = (tempY, tempX) => {
        let point = this.board[tempY][tempX]
        if (point === undefined) {
            if (isJumped) return
            pointList.push([tempY, tempX])
            console.log(tempY, tempX)
        } else {
            if (!isJumped) { // meet first chess, can jump and return
                isJumped = true
                return
            }
            if (point.type !== thisPoint.type) {
                pointList.push([tempY, tempX])
                console.log(tempY, tempX)
                isJumped = false
            }
            return true
        }
    }
    console.log('上')
    isJumped = false
    while (this.isInY(--upY)) {
        if (paoGoPoint(upY, x)) {
            break
        }
    }
    console.log('下')
    isJumped = false
    while (this.isInY(++downY)) {
        if (paoGoPoint(downY, x)) {
            break
        }
    }
    console.log('左')
    isJumped = false
    while (this.isInX(--leftX)) {
        if (paoGoPoint(y, leftX)) {
            break
        }
    }
    console.log('右')
    isJumped = false
    while (this.isInX(++rightX)) {
        if (paoGoPoint(y, rightX)) {
            break
        }
    }
    this.drawCanGoPoint(pointList, y, x)
}
/**
 * 兵的走法
 * @param y
 * @param x
 */
Chessboard.prototype.bingGo = function (y, x) {
    const thisPoint = this.board[y][x]
    let pointList = [] // points where this chess can go
    console.info('兵可以走的点')
    let upY = y
    let downY = y
    let leftX = x
    let rightX = x

    let goLeftRight = () => {
        console.log('左')
        if (this.isInX(--leftX)) {
            let point = this.board[y][leftX]
            if (point === undefined) {
                pointList.push([y, leftX])
                console.log(y, leftX)
            } else {
                if (point.type !== thisPoint.type) {
                    pointList.push([y, leftX])
                    console.log(y, leftX)
                }
            }
        }
        console.log('右')
        if (this.isInX(++rightX)) {
            let point = this.board[y][rightX]
            if (point === undefined) {
                pointList.push([y, rightX])
                console.log(y, rightX)
            } else {
                if (point.type !== thisPoint.type) {
                    pointList.push([y, rightX])
                    console.log(y, rightX)
                }
            }
        }
    }
    // just up, judge direction
    if (thisPoint.isGoUp) {
        if (this.isInY(--upY)) {
            let point = this.board[upY][x]
            if (point === undefined) {
                pointList.push([upY, x])
                console.log(upY, x)
            } else {
                if (point.type !== thisPoint.type) {
                    pointList.push([upY, x])
                    console.log(upY, x)
                }
            }
        }
        // crossed the river, can go left and right
        if (y <= 4) {
            goLeftRight()
        }
    } else {
        if (this.isInY(++downY)) {
            let point = this.board[downY][x]
            if (point === undefined) {
                pointList.push([downY, x])
                console.log(downY, x)
            } else {
                if (point.type !== thisPoint.type) {
                    pointList.push([downY, x])
                    console.log(downY, x)
                }
            }
        }
        if (y >= 4) {
            goLeftRight()
        }
    }
    console.log('下')

    this.drawCanGoPoint(pointList, y, x)
}
/**
 * 士的走法
 * @param y
 * @param x
 */
Chessboard.prototype.shiGo = function (y, x) {
    const thisPoint = this.board[y][x]
    let pointList = [] // points where this chess can go
    // just need to judge four points
    let x1 = x - 1
    let x2 = x + 1
    let y1 = y - 1
    let y2 = y + 1

    let shiGoPoint = (tempY, tempX) => {
        if (this.isInBoundary(tempY, tempX) && this.isInGong(tempY, tempX)) {
            let point = this.board[tempY][tempX]
            // if that point is inGong, undefined or not the same type
            if (point === undefined) {
                pointList.push([tempY, tempX])
            } else if (point.type !== thisPoint.type) {
                pointList.push([tempY, tempX])
            }
        }
    }
    shiGoPoint(y1, x1)
    shiGoPoint(y1, x2)
    shiGoPoint(y2, x1)
    shiGoPoint(y2, x2)
    this.drawCanGoPoint(pointList, y, x)
}
/**
 * 将、帅的走法
 * @param y
 * @param x
 */
Chessboard.prototype.jiangGo = function (y, x) {
    const thisPoint = this.board[y][x]
    let pointList = [] // points where this chess can go
    // just need to judge four points
    let x1 = x - 1
    let x2 = x + 1
    let y1 = y - 1
    let y2 = y + 1

    let jiangGoPoint = (tempY, tempX) => {
        if (this.isInBoundary(tempY, tempX) && this.isInGong(tempY, tempX)) {
            let point = this.board[tempY][tempX]
            // if that point is inGong, undefined or not the same type
            if (point === undefined) {
                pointList.push([tempY, tempX])
            } else if (point.type !== thisPoint.type) {
                pointList.push([tempY, tempX])
            }
        }
    }
    jiangGoPoint(y1, x)
    jiangGoPoint(y2, x)
    jiangGoPoint(y, x1)
    jiangGoPoint(y, x2)
    this.drawCanGoPoint(pointList, y, x)
}
/**
 * 提示闪烁
 */
Chessboard.prototype.tipBlink = function() {
    let blinkNum = 0
    const timer = setInterval(()=>{
        if (blinkNum < 7) {
            if (blinkNum % 2 ===0) {
                this.tipElement.style.color = "red"
                this.tipElement.style.fontSize = "100px"
            } else {
                this.tipElement.style.color = "black"
                this.tipElement.style.fontSize = "30px"
            }
        } else {
            this.tipElement.style.color = "black"
            this.tipElement.style.fontSize = "30px"
            clearInterval(timer)
        }
        blinkNum++
    },300)
}

Chessboard.prototype.closeBoard = function(){
    this.boardElement.innerHTML = ''
    this.tipElement.innerText = '已经关闭啦'
}
