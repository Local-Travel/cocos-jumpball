import { _decorator, Component, Node } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('CameraControl')
export class CameraControl extends Component {
    private _vz: number = -10
    private _passTime: number = 0

    @property(GameManager)
    gameManager: GameManager = null

    start() {

    }

    update(deltaTime: number) {
        // console.log('deltaTime', deltaTime)
        this._passTime += deltaTime
        const pos = this.node.getWorldPosition()
        pos.z += this._vz * deltaTime
        this.node.setWorldPosition(pos)
        if (this._passTime > 1 && this.gameManager) {
            this._passTime = 0
            this.gameManager.jumpNext()
        }
    }
}

