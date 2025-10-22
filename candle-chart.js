// HeliCat Candle Chart Animation
// Dynamic candlestick chart showing the journey to the moon!

class CandleChart {
    constructor() {
        this.canvas = document.getElementById('candle-chart');
        if (!this.canvas) {
            console.error('❌ Candle chart canvas not found!');
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.candles = [];
        this.maxCandles = 30;
        this.candleWidth = 20;
        this.candleSpacing = 8;
        this.time = 0;
        this.animationSpeed = 0.02;
        this.basePrice = 100;
        this.currentPrice = 100;
        this.trend = 1; // 1 for up, -1 for down

        this.setupCanvas();
        this.generateInitialCandles();
        this.animate();

        console.log('✅ Candle chart initialized');
    }

    setupCanvas() {
        // Get container size
        const container = this.canvas.parentElement;
        const width = container.clientWidth;
        const height = 400; // Fixed height

        this.canvas.width = width;
        this.canvas.height = height;

        this.width = width;
        this.height = height;

        console.log(`📊 Chart canvas: ${width}x${height}`);
    }

    generateInitialCandles() {
        let price = this.basePrice;

        for (let i = 0; i < this.maxCandles; i++) {
            const candle = this.generateCandle(price);
            this.candles.push(candle);
            price = candle.close;
        }
    }

    generateCandle(previousClose) {
        // Generate realistic candle with volatility
        const volatility = 0.03; // 3% volatility for more natural growth
        const trendStrength = 1.0; // Always goes up! 🚀

        // Always go up to the moon!
        const goesUp = true;

        const open = previousClose;
        const change = previousClose * volatility * (Math.random() * 0.5 + 0.5);
        const close = open + (goesUp ? change : -change);

        // High and low with wicks
        const wickSize = Math.abs(close - open) * (Math.random() * 0.5 + 0.5);
        const high = Math.max(open, close) + wickSize * Math.random();
        const low = Math.min(open, close) - wickSize * Math.random();

        return {
            open,
            high,
            low,
            close,
            bullish: close > open,
            alpha: 1.0
        };
    }

    updateCandles() {
        // Slowly shift candles and add new ones
        this.time += this.animationSpeed;

        if (this.time >= 1) {
            this.time = 0;

            // Remove oldest candle
            if (this.candles.length > 0) {
                this.candles[0].alpha -= 0.1;
                if (this.candles[0].alpha <= 0) {
                    this.candles.shift();
                }
            }

            // Add new candle
            const lastCandle = this.candles[this.candles.length - 1];
            const newCandle = this.generateCandle(lastCandle.close);
            this.candles.push(newCandle);

            this.currentPrice = newCandle.close;

            // Always to the moon! 🚀
            this.trend = 1; // Always uptrend!
        }
    }

    getChartPath() {
        // Returns array of {x, y} positions following the candle tops
        // This will be used by the flying cat to follow the chart
        const path = [];
        const totalWidth = this.candleWidth + this.candleSpacing;

        // Find min and max prices for scaling
        const allPrices = this.candles.flatMap(c => [c.high, c.low]);
        const minPrice = Math.min(...allPrices);
        const maxPrice = Math.max(...allPrices);
        const priceRange = maxPrice - minPrice;
        const padding = 40;

        this.candles.forEach((candle, index) => {
            const x = this.width - (this.candles.length - index) * totalWidth;
            const y = padding + (this.height - padding * 2) * (1 - (candle.high - minPrice) / priceRange);

            path.push({ x, y, price: candle.close });
        });

        return path;
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#0a0a1a';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw grid lines
        this.drawGrid();

        // Draw candles
        this.drawCandles();

        // Draw price label
        this.drawPriceLabel();
    }

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;

        // Horizontal grid lines
        for (let i = 0; i < 5; i++) {
            const y = (this.height / 5) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }

        // Vertical grid lines
        const totalWidth = this.candleWidth + this.candleSpacing;
        for (let i = 0; i < this.candles.length; i += 5) {
            const x = this.width - (this.candles.length - i) * totalWidth;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
    }

    drawCandles() {
        const totalWidth = this.candleWidth + this.candleSpacing;

        // Find min and max prices for scaling
        const allPrices = this.candles.flatMap(c => [c.high, c.low]);
        const minPrice = Math.min(...allPrices);
        const maxPrice = Math.max(...allPrices);
        const priceRange = maxPrice - minPrice;
        const padding = 40;

        this.candles.forEach((candle, index) => {
            const x = this.width - (this.candles.length - index) * totalWidth;

            // Scale prices to canvas height
            const openY = padding + (this.height - padding * 2) * (1 - (candle.open - minPrice) / priceRange);
            const closeY = padding + (this.height - padding * 2) * (1 - (candle.close - minPrice) / priceRange);
            const highY = padding + (this.height - padding * 2) * (1 - (candle.high - minPrice) / priceRange);
            const lowY = padding + (this.height - padding * 2) * (1 - (candle.low - minPrice) / priceRange);

            const bodyTop = Math.min(openY, closeY);
            const bodyBottom = Math.max(openY, closeY);
            const bodyHeight = Math.abs(closeY - openY);

            // Colors
            const color = candle.bullish ? '#4ade80' : '#f87171'; // Green or red
            const alpha = candle.alpha;

            this.ctx.globalAlpha = alpha;

            // Draw wick (high-low line)
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x + this.candleWidth / 2, highY);
            this.ctx.lineTo(x + this.candleWidth / 2, lowY);
            this.ctx.stroke();

            // Draw body (open-close rectangle)
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, bodyTop, this.candleWidth, Math.max(bodyHeight, 2));

            // Add glow effect for recent candles
            if (index >= this.candles.length - 3) {
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = color;
                this.ctx.fillRect(x, bodyTop, this.candleWidth, Math.max(bodyHeight, 2));
                this.ctx.shadowBlur = 0;
            }
        });

        this.ctx.globalAlpha = 1.0;
    }

    drawPriceLabel() {
        const price = this.currentPrice.toFixed(2);
        const percentChange = ((this.currentPrice - this.basePrice) / this.basePrice * 100).toFixed(2);
        const isPositive = percentChange >= 0;

        this.ctx.fillStyle = isPositive ? '#4ade80' : '#f87171';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`$${price}`, this.width - 20, 35);

        this.ctx.font = 'bold 18px Arial';
        this.ctx.fillText(
            `${isPositive ? '+' : ''}${percentChange}%`,
            this.width - 20,
            60
        );

        // "TO THE MOON" indicator when price is up significantly
        if (percentChange > 50) {
            this.ctx.fillStyle = '#ffe66d';
            this.ctx.font = 'bold 20px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText('🚀 TO THE MOON! 🚀', 20, 35);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.updateCandles();
        this.draw();
    }

    // Method to get current chart path for the flying cat
    getCurrentPath() {
        return this.getChartPath();
    }
}

// Initialize when page loads
let candleChart;
window.addEventListener('DOMContentLoaded', () => {
    candleChart = new CandleChart();
});
