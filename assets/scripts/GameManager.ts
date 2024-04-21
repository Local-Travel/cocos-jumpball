import { _decorator, Component, instantiate, math, Node, v3, Vec3 } from 'cc';
import { BallControl } from './BallControl';
import { CameraControl } from './CameraControl';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(BallControl)
    ballControl: BallControl = null

    @property(CameraControl)
    cameraControl: CameraControl = null

    @property(Node)
    platRoot: Node = null

    private _platIndex = 0
    private _startPlat: Node = null

    start() {
        const initPlat = this.node.getChildByName('startPlat')
        this._startPlat = instantiate(initPlat)
        
        this._platIndex = 0
        for(let i = 0; i < 15; i++) {
            this._generatePlat()
        }
        this.jumpNext()
    }

    update(deltaTime: number) {
        
    }
    
    protected onDestroy(): void {
        const pLen = this.platRoot.children.length
        for(let i = 0; i < pLen; i++) {
            this.platRoot.children[i].destroy()
        }
    }

    jumpNext() {
        const platNodes = this.platRoot.children
        if (this._platIndex >= platNodes.length) {
            return
        }
        const pos = platNodes[this._platIndex++].getWorldPosition()
        pos.y = 0.5
        if (this.ballControl) {
            this.ballControl.JumpTo(pos, this)
        }
        this._generatePlat()
        this._removePlat()
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
}

