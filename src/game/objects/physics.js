class rigidObj extends overlapObj {
    constructor(x, y, width, height, applyGravity, immovable) {
        super(x, y, width, height);
        this.moveYspeed = 0;
        this.moveXspeed = 0;
        this.applyGravity = applyGravity;
        this.immovable = immovable;
    }
    addVector(angle, force) {
        this.moveXspeed += Math.cos(angle) * force;
        this.moveYspeed -= Math.sin(angle) * force;
    }
    returnVector() {
        let angle = Math.acos(this.moveXspeed);
        if (this.moveYspeed > 0)
            angle = Math.PI + (Math.PI - angle);
        return {
            angle: angle,
            force: this.moveXspeed / Math.cos(angle)
        };
    }
    setResistance(moveResistanceX, moveResistanceY) {
        if (this.moveYspeed < 0)
            this.moveYspeed = Math.min(0, this.moveYspeed += moveResistanceY);
        if (this.moveYspeed > 0)
            this.moveYspeed = Math.max(0, this.moveYspeed -= moveResistanceY);
        if (this.moveXspeed < 0)
            this.moveXspeed = Math.min(0, this.moveXspeed += moveResistanceX);
        if (this.moveXspeed > 0)
            this.moveXspeed = Math.max(0, this.moveXspeed -= moveResistanceX);
    }
    move() {
        this.x = Math.round(this.x + this.moveXspeed);
        this.y = Math.round(this.y + this.moveYspeed);
    }
    checkOverlapWithSpeed(x, y, width, height) {
        if ((this.x + this.moveXspeed < x + width) && (this.x + this.moveXspeed + this.width > x) &&
            (this.y + this.moveYspeed < y + height) && (this.y + this.moveYspeed + this.height > y)) {
            this.collision = "dsf";
            return true;
        }
        return false;
    }
    whichSideIsOverlappingSooner({ x: x, y: y, width: width, height: height }) {
        let howDeepX;
        let howDeepY;
        if (this.moveXspeed < 0 && this.moveYspeed < 0) {
            howDeepX = this.x + this.moveXspeed - (x + width);
            howDeepY = this.y + this.moveYspeed - (y + height);
            if (howDeepX / this.moveXspeed < howDeepY / this.moveYspeed)
                return this.collision = 'left';
            if (howDeepX / this.moveXspeed > howDeepY / this.moveYspeed)
                return this.collision = 'top';
            return 'topleft';
        }
        if (this.moveXspeed < 0 && this.moveYspeed > 0) {
            howDeepX = this.x + this.moveXspeed - (x + width);
            howDeepY = this.y + this.moveYspeed + this.height - y;
            if (howDeepX / this.moveXspeed < howDeepY / this.moveYspeed)
                return this.collision = 'left';
            if (howDeepX / this.moveXspeed > howDeepY / this.moveYspeed)
                return this.collision = 'bottom';
            return 'bottomleft';
        }
        if (this.moveXspeed > 0 && this.moveYspeed < 0) {
            howDeepX = this.x + this.moveXspeed + this.width - x;
            howDeepY = this.y + this.moveYspeed - (y + height);
            if (howDeepX / this.moveXspeed < howDeepY / this.moveYspeed)
                return this.collision = 'right';
            if (howDeepX / this.moveXspeed > howDeepY / this.moveYspeed)
                return this.collision = 'top';
            return 'topright';
        }
        if (this.moveXspeed > 0 && this.moveYspeed > 0) {
            howDeepX = this.x + this.moveXspeed + this.width - x;
            howDeepY = this.y + this.moveYspeed + this.height - y;
            if (howDeepX / this.moveXspeed < howDeepY / this.moveYspeed)
                return this.collision = 'right';
            if (howDeepX / this.moveXspeed > howDeepY / this.moveYspeed)
                return this.collision = 'bottom';
            return 'bottomright';
        }
    }
    rigidCollision({ x: x, y: y, width: width, height: height }) {
        if (!this.checkOverlapWithSpeed(x, y, width, height))
            return;
        if (this.moveYspeed == 0) {
            if (this.moveXspeed > 0 || (this.moveXspeed == 0 && this.x + this.width > x && this.x + this.width < x + width)) {
                this.x = x - this.width;
                this.collision = "right";
            }
            if (this.moveXspeed < 0 || (this.moveYspeed == 0 && this.x > x && this.x < x + width)) {
                this.x = x + width;
                this.collision = "left";
            }
            this.moveXspeed = 0;
        }
        if (this.moveXspeed == 0) {
            if (this.moveYspeed > 0) {
                this.y = y - this.height;
                this.collision = "bottom";
            }
            if (this.moveYspeed < 0) {
                this.y = y + height;
                this.collision = "top";
            }
            this.moveYspeed = 0;
        }
        this.whichSideIsOverlappingSooner({ x, y, width, height });
        switch (this.collision) {
            case 'top':
                this.y = y + height;
                this.moveYspeed = 0;
                break;
            case 'bottom':
                this.y = y - this.height;
                this.moveYspeed = 0;
                break;
            case 'right':
                this.x = x - this.width;
                this.moveXspeed = 0;
                break;
            case 'left':
                this.x = x + width;
                this.moveXspeed = 0;
                break;
            default:
                this.moveXspeed = 0;
                this.moveYspeed = 0;
        }
        return this.collision;
    }
    todo() {
        if (this.applyGravity)
            this.addVector(3 * Math.PI / 2, gravity);
        this.setResistance(0.20, 0.20);
    }
}
//# sourceMappingURL=physics.js.map