class Fraction {
    constructor(num, den) {
        this._num = num;
        this._den = den;
        this.normalize();
    }
    get num() {
        return this._num;
    }
    get den() {
        return this._den;
    }
    set num(newNum) {
        this._num = newNum;
        this.normalize();
    }
    set den(newDen) {
        this._den = newDen;
        this.normalize();
    }
    add_num(rhs) {
        return this.add_frac(new Fraction(rhs, 1))
    }
    add_frac(rhs) {
        return new Fraction(this.num * rhs.den + rhs.num * this.den, this.den * rhs.den);
    }
    mul_num(rhs) {
        return this.mul_frac(new Fraction(rhs, 1))
    }
    mul_frac(rhs) {
        return new Fraction(this.num * rhs.num, this.den * rhs.den);
    }
    pow_num(rhs) {
        return new Fraction(Math.pow(this.num, rhs), Math.pow(this.den, rhs));
    }
    add_inv() {
        return new Fraction(-this.num, this.den);
    }
    mul_inv() {
        return new Fraction(this.den, this.num);
    }
    display() {
        return `<sup>${this.num}</sup>&frasl;<sub>${this.den}</sub>`;
    }
    display_mixed() {
        let whole = this.proper_whole();
        return (whole == 0 ? "" : `${this.proper_whole()}`) + `${this.proper_frac().display()}`;
    }
    decimal() {
        return this.num / this.den;
    }
    proper_whole() {
        return Math.floor(this.num / this.den);
    }
    proper_frac() {
        return this.add_num(-this.proper_whole());
    }
    gcd() {
        let a = Math.abs(Math.max(this._num, this._den));
        let b = Math.abs(Math.min(this._num, this._den));
        while (true) {
            if (b == 0) return a;
            a %= b;
            if (a == 0) return b;
            b %= a;
        }
    }
    normalize() {
        let gcd = this.gcd();
        let sgn = Math.sign(this._num);
        this._num = Math.abs(this._num / gcd) * sgn;
        this._den = Math.abs(this._den / gcd);
    }
}

const CHICKEN_PAYOUT_RATE = new Fraction(35, 256);
const ANY_CHICKEN_CHANCE = new Fraction(1, 8);

Vue.createApp({
    data: () => ({
        pay: 1,
        egg: 1,
        payout: 1,
        payoutEveryChicken: false,
    }),
    methods: {

    },
    computed: {
        payDiamondOrDiamonds() {
            return this.pay == 1 ? "diamond" : "diamonds"
        },
        payoutDiamondOrDiamonds() {
            return this.payout == 1 ? "diamond" : "diamonds"
        },
        eggOrEggs() {
            return this.egg == 1 ? "egg" : "eggs"
        },
        termThatOrThose() {
            return this.egg == 1 ? "that" : "those"
        },
        termAOrAny() {
            return this.egg == 1 ? "a" : "any"
        },
        termChickenOrChickens() {
            return this.egg == 1 ? "chicken" : "chickens"
        },
        payoutTerms() {
            return this.payoutEveryChicken
                ? "For every chicken they hatch"
                : `If they hatch ${this.termAOrAny} ${this.termChickenOrChickens} from ${this.termThatOrThose} ${this.egg} ${this.eggOrEggs}`
        },
        changeTerms() {
            return this.payoutEveryChicken
                ? "Any chicken instead"
                : "Each chicken instead"
        },
        expectedChickens() {
            return CHICKEN_PAYOUT_RATE.mul_num(this.egg)
        },
        expectedChickensFrac() {
            return this.expectedChickens.display_mixed()
        },
        expectedChickensDec() {
            return this.expectedChickens.decimal().toFixed(2)
        },
        expectedPayoutFromChickens() {
            return this.expectedChickens.decimal() * this.payout
        },
        expectedAnyChicken() {
            return ANY_CHICKEN_CHANCE.add_inv().add_num(1).pow_num(this.egg).add_inv().add_num(1)
        },
        expectedAnyChickenFrac() {
            return this.expectedAnyChicken.display_mixed()
        },
        expectedAnyChickenPct() {
            return (this.expectedAnyChicken.decimal() * 100).toFixed(2) + "%"
        },
        expectedPayoutFromAnyChicken() {
            return this.expectedAnyChicken.decimal() * this.payout
        },
        expectedPayout() {
            return this.payoutEveryChicken ? this.expectedPayoutFromAnyChicken : this.expectedPayoutFromChickens;
        },
        expectedPayoutDisplay() {
            return this.expectedPayout.toFixed(2)
        },
        expectedProfit() {
            return this.pay - this.expectedPayout
        },
        expectedProfitDisplay() {
            return Math.abs(this.expectedProfit.toFixed(2))
        },
        willProfit() {
            return this.expectedProfit > 0
        },
        makeOrLose() {
            return this.willProfit ? "make" : "lose"
        },
        payoutStyle() {
            return { 'bg-success': this.willProfit, 'bg-danger': !this.willProfit }
        }
    }
}).mount('body')