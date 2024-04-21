import { _decorator, Component, Node } from 'cc';
import { GameManager } from './GameManager';
import { PoolManager } from './PoolManager';
const { ccclass, property } = _decorator;

const XRANGE = 15
@ccclass('FloadBall')
export class FloadBall extends Component {
    
    private _bulletSpeed = 0.05

    start() {

    }

    update(deltaTime: number) {
        let pos = this.node.position
        this.node.setPosition(pos.x, pos.y, pos.z + this._bulletSpeed)

        pos = this.node.position
        if (pos.z > -10) {
            this.node.active = false
        }
        if (pos.z > 50) {
            PoolManager.instance().putNode(this.node)
        }
    }
}

