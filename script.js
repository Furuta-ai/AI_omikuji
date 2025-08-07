// プロンプトデータベース
const promptDatabase = {
    midjourney: {
        art: [
            "whimsical watercolor style tiny fairies living in enchanted forest, magical atmosphere --ar 3:4 --style raw",
            "futuristic cyberpunk cityscape at night with neon lights, cinematic view --ar 16:9 --v 6",
            "golden sunset streaming through old mansion windows, nostalgic atmosphere --ar 2:3",
            "colorful planets floating in space with aurora effects, cosmic scene --ar 1:1 --style raw",
            "cute hand-drawn animals having tea party, kawaii style illustration --ar 4:5"
        ],
        photo: [
            "golden hour silhouette of person walking on beach, cinematic movie scene --ar 21:9",
            "macro photography morning dew on flower petals, extreme close-up --ar 3:4",
            "street photography Tokyo alley after rain, neon reflections on wet pavement --ar 4:5",
            "portrait natural light smiling woman, soft lighting, professional headshot --ar 2:3",
            "landscape mountain peaks above sea of clouds, drone aerial shot --ar 16:9"
        ],
        design: [
            "minimal elegant logo design, monochrome, clean geometric lines --ar 1:1",
            "kawaii character design with pastel colors, cute mascot style --ar 1:1",
            "modern typography poster with bold letters, graphic design --ar 2:3",
            "abstract geometric pattern design, seamless repeating texture --ar 1:1 --tile",
            "retro futuristic UI/UX interface design, neon elements --ar 16:9"
        ],
        fun: [
            "cat astronaut walking on moon surface, space suit, whimsical scene --ar 3:4",
            "tiny people living on planet made of donuts, fantasy world --ar 1:1",
            "magical world inside giant open book, fantasy landscape --ar 2:3",
            "dragon relaxing on cloud sofa, cozy fantasy scene --ar 4:3",
            "dancing sushi characters, kawaii food illustration --ar 1:1"
        ]
    },
    chatgpt: {
        writing: [
            "10年後の自分に向けた手紙を書いてください。今の夢や目標について具体的に述べてください。",
            "もし動物と話せたら何を聞きたいか、その理由と一緒に短編小説を書いてください。",
            "「時間」をテーマにした詩を3パターン（自由詩、短歌、俳句）で作ってください。",
            "宇宙人が地球に来た時の第一印象について、ユーモアを交えて日記形式で書いてください。",
            "好きな季節について、五感を使って描写した散文詩を書いてください。"
        ],
        business: [
            "30代向けの新しいサブスクリプションサービスのアイデアを3つ考えて、それぞれのビジネスモデルを説明してください。",
            "リモートワークの生産性を上げるための革新的なツールアイデアを提案してください。",
            "Z世代をターゲットにしたマーケティング戦略を、具体例と共に提案してください。",
            "小さなカフェが大手チェーンと差別化するためのユニークな戦略を考えてください。",
            "持続可能な社会を目指す企業の新事業アイデアを環境配慮の観点から提案してください。"
        ],
        fun: [
            "もし重力が突然半分になったら、日常生活はどう変わるか詳しく想像してください。",
            "あなたが魔法使いになったら、どんな呪文を開発したいか5つ考えてください。",
            "100年前の人に現代のスマートフォンを説明するとしたら、どう伝えますか？",
            "もし色に味があったら、それぞれの色はどんな味がするか想像してください。",
            "宇宙旅行が当たり前になった未来の観光ガイドブックを書いてください。"
        ],
        art: [
            "印象派の画家になったつもりで、今見えている風景を言葉で描写してください。",
            "音楽を色と形で表現するとしたら、あなたの好きな曲はどう見えますか？",
            "抽象画の解釈について、独自の視点から分析してください。",
            "もし絵画の中に入れたら、どの作品の世界を体験したいですか？その理由も含めて。",
            "身近な物を使ったアートインスタレーションのアイデアを3つ提案してください。"
        ]
    }
};

// 共通プロンプト（どちらでも使える）
const commonPrompts = [
    "今日の気分を色で表現してください",
    "理想の一日のスケジュールを考えてください", 
    "もし超能力が使えたら何をしたいですか？",
    "好きな食べ物について熱く語ってください",
    "10年後の世界を予想してください"
];

// DOM要素
const fortuneBtn = document.getElementById('fortune-btn');
const resultArea = document.getElementById('result-area');
const promptText = document.getElementById('prompt-text');
const promptCategory = document.getElementById('prompt-category');
const copyBtn = document.getElementById('copy-btn');
const twitterBtn = document.getElementById('twitter-btn');
const retryBtn = document.getElementById('retry-btn');
const categorySelect = document.getElementById('category-select');

// メイン機能：おみくじを引く
function drawFortune() {
    const selectedTool = document.querySelector('input[name="ai-tool"]:checked').value;
    const selectedCategory = categorySelect.value;
    
    // ボタンにローディング効果
    fortuneBtn.classList.add('loading');
    fortuneBtn.textContent = '占い中...';
    
    // 少し遅延を入れて演出
    setTimeout(() => {
        let randomPrompt;
        let categoryName;
        
        if (selectedCategory === 'random') {
            // カテゴリーがランダムの場合
            randomPrompt = getRandomPromptFromAll();
            categoryName = 'ランダム';
        } else if (selectedTool === 'both') {
            // ツールが「どちらでも」でカテゴリー指定ありの場合
            randomPrompt = getRandomPromptFromCategory(selectedCategory);
            categoryName = getCategoryDisplayName(selectedCategory);
        } else {
            // 指定された条件で選択
            const prompts = promptDatabase[selectedTool]?.[selectedCategory];
            if (prompts && prompts.length > 0) {
                randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
                categoryName = getCategoryDisplayName(selectedCategory);
            } else {
                // フォールバック
                randomPrompt = getRandomPromptFromAll();
                categoryName = 'ランダム';
            }
        }
        
        // 結果表示
        displayResult(randomPrompt, categoryName, selectedTool);
        
        // ボタンを元に戻す
        fortuneBtn.classList.remove('loading');
        fortuneBtn.textContent = '🎲 おみくじを引く';
        
        // 結果エリアをアニメーション付きで表示
        resultArea.style.display = 'block';
        resultArea.classList.add('show');
        
        // 結果エリアまでスクロール
        resultArea.scrollIntoView({ behavior: 'smooth' });
        
    }, 1000);
}

// ランダムにプロンプトを選択
function getRandomPromptFromAll() {
    const allPrompts = [];
    
    // すべてのプロンプトを配列に集める
    Object.values(promptDatabase).forEach(toolPrompts => {
        Object.values(toolPrompts).forEach(categoryPrompts => {
            allPrompts.push(...categoryPrompts);
        });
    });
    
    // 共通プロンプトも追加
    allPrompts.push(...commonPrompts);
    
    return allPrompts[Math.floor(Math.random() * allPrompts.length)];
}

// 特定のカテゴリーからプロンプトを選択（両方のツールから）
function getRandomPromptFromCategory(category) {
    const categoryPrompts = [];
    
    // 指定されたカテゴリーのプロンプトを両方のツールから集める
    Object.values(promptDatabase).forEach(toolPrompts => {
        if (toolPrompts[category]) {
            categoryPrompts.push(...toolPrompts[category]);
        }
    });
    
    // カテゴリーのプロンプトがない場合は共通プロンプトから
    if (categoryPrompts.length === 0) {
        return commonPrompts[Math.floor(Math.random() * commonPrompts.length)];
    }
    
    return categoryPrompts[Math.floor(Math.random() * categoryPrompts.length)];
}

// カテゴリー名を表示用に変換
function getCategoryDisplayName(category) {
    const names = {
        art: 'アート・イラスト',
        photo: '写真・リアル', 
        design: 'デザイン',
        writing: '文章・創作',
        business: 'ビジネス',
        fun: 'エンタメ・面白系'
    };
    return names[category] || category;
}

// 結果を表示
function displayResult(prompt, category, tool) {
    promptText.textContent = prompt;
    
    const toolName = tool === 'midjourney' ? 'Midjourney' : 
                     tool === 'chatgpt' ? 'ChatGPT' : 
                     '汎用';
    
    promptCategory.textContent = `カテゴリー: ${category} | 対象: ${toolName}`;
}

// コピー機能
function copyToClipboard() {
    const text = promptText.textContent;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showCopySuccess();
        });
    } else {
        // フォールバック
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showCopySuccess();
    }
}

// コピー成功表示
function showCopySuccess() {
    copyBtn.textContent = '✅ コピー完了!';
    copyBtn.classList.add('copy-success');
    
    setTimeout(() => {
        copyBtn.textContent = '📋 コピー';
        copyBtn.classList.remove('copy-success');
    }, 2000);
}

// Twitterシェア機能
function shareOnTwitter() {
    const prompt = promptText.textContent;
    const text = `AIプロンプトおみくじで今日のお題が決まりました✨\n\n"${prompt}"\n\n#AIプロンプトおみくじ #AI創作`;
    const url = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    
    window.open(twitterUrl, '_blank');
}

// もう一回機能
function retry() {
    resultArea.classList.remove('show');
    setTimeout(() => {
        resultArea.style.display = 'none';
        document.querySelector('.selection-area').scrollIntoView({ behavior: 'smooth' });
    }, 300);
}

// イベントリスナー
fortuneBtn.addEventListener('click', drawFortune);
copyBtn.addEventListener('click', copyToClipboard);
twitterBtn.addEventListener('click', shareOnTwitter);
retryBtn.addEventListener('click', retry);

// エンターキーでもおみくじを引けるようにする
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && resultArea.style.display === 'none') {
        drawFortune();
    }
});

// ページロード時の初期化
document.addEventListener('DOMContentLoaded', () => {
    // 初期状態では結果エリアは非表示
    resultArea.style.display = 'none';
});