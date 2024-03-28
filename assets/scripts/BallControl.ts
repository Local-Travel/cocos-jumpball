import { _decorator, Component, Node, Vec3 } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('BallControl')
export class BallControl extends Component {
    @property(Node)
    public camera: Node = null

    private _cameraOffsetZ: number = 0
    private _gravity: number = -10

    private _vx: number = 0
    private _vy: number = 0
    private _vz: number = -10

    private _jumpTime: number = 0
    private _passTime: number = 0
    private _isJumping: boolean = false
    private _gameManager: GameManager = null

    start() {
        this._cameraOffsetZ = this.camera.worldPosition.z - this.node.worldPosition.z
    }

    update(deltaTime: number) {
        let dt = deltaTime
        if (this._isJumping === false) {
            return
        }

        this._passTime += dt
        if (this._passTime > this._jumpTime) {
            dt -= this._passTime - this._jumpTime 
        }

        const pos = this.node.getWorldPosition()
        pos.x += this._vx * dt
        pos.z += this._vz * dt
        
        pos.y += (this._vy * dt + 0.5 * this._gravity * dt * dt)
        this._vy += this._gravity * dt

        this.node.setWorldPosition(pos)
        if (this._passTime >= this._jumpTime) {// 跳跃完成
            this._isJumping = false
            this._gameManager.jumpNext()
        }
    }

    protected lateUpdate(dt: number): void {
        const pos = this.camera.getWorldPosition()
        pos.z = this.node.worldPosition.z + this._cameraOffsetZ
        this.camera.setPosition(pos)
    }

    public JumpTo(dst: Vec3, gameManager: GameManager) {
        if (this._isJumping) {
            return
        }
        this._gameManager = gameManager

        const pos = this.node.getWorldPosition()
        this._jumpTime = (dst.z - pos.z) / this._vz

        if (this._jumpTime <= 0) {
            this._isJumping = false
            return
        }

        this._vx = (dst.x - pos.x) / this._jumpTime
        this._vy = -this._gravity * this._jumpTime * 0.5

        this._isJumping = true
        this._passTime = 0
    }
}

