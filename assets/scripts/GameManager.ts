import { _decorator, Component, instantiate, math, Node, v3, Vec3 } from 'cc';
import { BallControl } from './BallControl';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(BallControl)
    ballControl: BallControl = null

    @property(Node)
    platRoot: Node = null
    
    @property(Node)
    floatBallRoot: Node = null


    private _platIndex = 0
    private _ballIndex = 0
    private _startPlat: Node = null
    private _startBall: Node = null

    start() {
        const initPlat = this.node.getChildByName('startPlat')
        this._startPlat = instantiate(initPlat)
        const initBall = this.node.getChildByName('startBall')
        this._startBall = instantiate(initBall)

        this._platIndex = 0
        this._ballIndex = 0
        for(let i = 0; i < 15; i++) {
            this._generatePlat()
        }
        for(let i = 0; i < 15; i++) {
            this._generateBatchBall()
        }
        this.jumpNext()
    }

    update(deltaTime: number) {
        
    }
    
    protected onDestroy(): void {
        const pLen = this.platRoot.children.length
        const bLen = this.floatBallRoot.children.length
        for(let i = 0; i < pLen; i++) {
            this.platRoot.children[i].destroy()
        }
        for(let i = 0; i < bLen; i++) {
            this.floatBallRoot.children[i].destroy()
        }
    }

    jumpNext() {
        const platNodes = this.platRoot.children
        if (this._platIndex >= platNodes.length) {
            return
        }
        const pos = platNodes[this._platIndex++].getWorldPosition()
        pos.y = 0.5
        this.ballControl.JumpTo(pos, this)
        this._generatePlat()
        this._removePlat()

        this._ballIndex += 1
        this._generateBatchBall()
        this._removeBall()
    }

    private _generatePlat() {
        const platNodes = this.platRoot.children
        let pos = v3(0, 0, 0)
        if (platNodes.length > 0) {
            pos = platNodes[platNodes.length - 1].getWorldPosition()
        }
        // 音乐类的游戏，关键是这里的randZ位置，不是随机的，而是根据速度*时间得到，音乐每个时间点策划会给到
        const randZ = math.randomRangeInt(0, 5)
        const randX = math.randomRangeInt(0, 3)
        pos.z -= (8 + randZ)
        if (pos.x <= 0) {
            pos.x += randX
        } else {
            pos.x -= randX
        }
        const newPlat = instantiate(this._startPlat)
        newPlat.setPosition(pos)
        this.platRoot.addChild(newPlat)
    }

    private _removePlat() {
        if (this._platIndex > 15) {
            for(let i = 0; i < 10; i++) {
                this.platRoot.children[0].removeFromParent()
            }
            this._platIndex -= 10
        }
    }

    private _generateBatchBall() {
        // 生成小球
        const children = this.floatBallRoot.children
        let lastPos = null
        if (children.length) {
            lastPos = children[children.length - 1].getWorldPosition()
        }
        
        const count = math.randomRangeInt(1, 4)
        for(let i = 0; i < count; i++) {
            this._generateBall(lastPos)
        }
    }

    private _generateBall(lastPos: Vec3 = null) {
        const ballNodes = this.floatBallRoot.children
        let pos = v3(0, 0, 0)
        if (lastPos) {
            pos = lastPos
        } else {
            if (ballNodes.length > 0) {
                pos = ballNodes[ballNodes.length - 1].getWorldPosition()
            }
        }
        
        // 音乐类的游戏，关键是这里的randZ位置，不是随机的，而是根据速度*时间得到，音乐每个时间点策划会给到
        const randZ = math.randomRangeInt(0, 5)
        const randX = math.randomRangeInt(0, 5)
        const randY = math.randomRangeInt(0, 10)
        pos.z -= (10 + randZ)
        if (pos.x <= 0) {
            pos.x += randX
        } else {
            pos.x -= randX
        }
        pos.y = randY
        const newBall = instantiate(this._startBall)
        newBall.setPosition(pos)
        this.floatBallRoot.addChild(newBall)
    }

    private _removeBall() {
        const len = this.floatBallRoot.children.length
        if (this._ballIndex > 15 && len > 20) {
            for(let i = 0; i < 20; i++) {
                this.floatBallRoot.children[0].removeFromParent()
            }
        }
        this._ballIndex -= 10
    }
}

