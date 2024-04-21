import { _decorator, Component, instantiate, math, Node, Prefab, v3, Vec3 } from 'cc';
import { GameManager } from './GameManager';
import { PoolManager } from './PoolManager';
const { ccclass, property } = _decorator;

@ccclass('BallManager')
export class BallManager extends Component {
    // @property(GameManager)
    // gameManager: GameManager = null
    @property(Prefab)
    ballPrefab: Prefab = null

    private _ballIndex: number = 0
    private _passTime: number = 0
    
    start() {
        this._ballIndex = 0
        for(let i = 0; i < 60; i++) {
            this._generateBatchBall()
        }
    }

    update(deltaTime: number) {
        this._passTime += deltaTime
        if (this._passTime > 0.05) {
            this._passTime = 0
            this.batchGenBall()
        }
    }

    protected onDestroy(): void {
        const bLen = this.node.children.length
        for(let i = 0; i < bLen; i++) {
            this.node.children[i].destroy()
        }
    }

    public batchGenBall() {
        this._ballIndex += 1
        this._generateBatchBall()
    }

    private _generateBatchBall() {
        // 生成小球
        const children = this.node.children
        let lastPos = null
        if (children.length) {
            lastPos = children[children.length - 1].getWorldPosition()
        }
        
        // const count = math.randomRangeInt(5, 10)
        const count = math.randomRangeInt(0, 10)
        const x = math.randomRangeInt(-9, 10)
        for(let i = 0; i < count; i++) {
            this._generateBall(lastPos, x, i)
        }
    }

    private _generateBall(lastPos: Vec3 = null, wx: number, index: number = 0) {
        const ballNodes = this.node.children
        // 半径
        const radius = 1.2
        let pos = v3(0, 0, 0)
        if (lastPos) {
            pos.x = wx
            pos.z = lastPos.z
        } else {
            if (ballNodes.length > 0) {
                const wPos = ballNodes[ballNodes.length - 1].getWorldPosition()
                pos.x = wx
                pos.z = wPos.z
            }
        }
        
        // 音乐类的游戏，关键是这里的randZ位置，不是随机的，而是根据速度*时间得到，音乐每个时间点策划会给到
        // const randZ = math.randomRangeInt(0, 5)
        // const randX = math.randomRangeInt(-9, 10)
        // const randY = math.randomRangeInt(0, 10)
        pos.z -= 2
        // if (pos.x <= 0) {
        //     pos.x += randX
        // } else {
        //     pos.x -= randX
        // }
        const s = radius * index
        pos.x += s
        // console.log('pos.x', pos.x)
        // x坐标限制在（-10，10）之间
        if (pos.x > 10) {
            pos.x = -10 + s
        }
        if (pos.x < -10) {
            pos.x = 10 - s
        }

        
        // pos.y = randY
        // const newBall = instantiate(this.ballPrefab)
        // newBall.setPosition(pos)
        // this.node.addChild(newBall)
        const newBall = PoolManager.instance().getNode(this.ballPrefab, this.node)
        newBall.active = true
        newBall.setPosition(pos)
    }
}

