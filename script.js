// 全局变量
let currentUser = null;
let currentRole = null;
let currentSurveyType = null;
let currentSection = 0;
let studentAnswers = {};
let parentAnswers = {};
let uploadedResources = [];

// 学生端题目sections
const studentSections = ['section-a', 'section-b', 'section-c'];

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化认证模块
    initAuthModule();
    
    // 初始化学生测评模块
    initStudentSurveyModule();
    
    // 初始化家长测评模块
    initParentSurveyModule();
    
    // 初始化结果模块
    initResultModule();
    
    // 初始化老师模块
    initTeacherModule();
    
    // 初始化管理员模块
    initAdminModule();
    
    // 初始化资源包模块
    initResourceModule();
    
    // 初始化编辑模态框
    initEditModal();
    
    // 初始化修改密码模态框
    initChangePasswordModal();
});

// 认证模块初始化
function initAuthModule() {
    // 标签切换
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            
            // 切换标签按钮状态
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 切换表单显示
            const forms = document.querySelectorAll('.form');
            forms.forEach(form => form.classList.remove('active'));
            document.getElementById(`${tab}-form`).classList.add('active');
        });
    });
    
    // 登录角色选择变化事件
    document.getElementById('login-role').addEventListener('change', function() {
        const role = this.value;
        const usernameField = document.getElementById('admin-login-fields');
        const passwordField = document.getElementById('admin-password-fields');
        
        if (role === 'admin') {
            usernameField.style.display = 'block';
            passwordField.style.display = 'block';
        } else {
            usernameField.style.display = 'none';
            passwordField.style.display = 'none';
        }
    });
    
    // 初始隐藏学生和老师的用户名密码字段
    document.getElementById('admin-login-fields').style.display = 'none';
    document.getElementById('admin-password-fields').style.display = 'none';
    
    // 登录按钮点击事件
    document.getElementById('login-btn').addEventListener('click', function() {
        const role = document.getElementById('login-role').value;
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        if (role === 'admin') {
            if (username === 'zszs782' && password === '19765525zs') {
                currentUser = username;
                currentRole = 'admin';
                showModule('admin-module');
            } else {
                alert('管理员账号或密码错误');
            }
        } else {
            // 学生和老师不需要用户名密码
            currentUser = role === 'student' ? '学生' : '老师';
            currentRole = role;
            
            // 跳转到对应角色的模块
            if (role === 'student') {
                showModule('student-survey-module');
            } else if (role === 'teacher') {
                showModule('teacher-survey-module');
            }
        }
    });
    
    // 注册按钮点击事件（如果存在）
    const registerBtn = document.getElementById('register-btn');
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            const role = document.getElementById('register-role').value;
            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            
            if (username && password && confirmPassword) {
                if (password === confirmPassword) {
                    // 模拟注册成功
                    alert('注册成功，请登录');
                    
                    // 切换到登录标签
                    document.querySelector('[data-tab="login"]').click();
                } else {
                    alert('两次输入的密码不一致');
                }
            } else {
                alert('请填写所有字段');
            }
        });
    }
}

// 学生测评模块初始化
function initStudentSurveyModule() {
    // 提交按钮点击事件
    document.getElementById('student-submit-btn').addEventListener('click', function() {
        // 验证必填题目
        const unanswered = validateStudentQuestions();
        if (unanswered.length > 0) {
            alert('请完成以下题目：\n' + unanswered.join('\n'));
            return;
        }
        
        // 显示加载提示
        showLoadingModal();
        
        // 保存所有答案
        saveStudentAnswers(0);
        
        // 分析结果
        analyzeStudentResults();
    });
}

// 验证学生题目是否已答
function validateStudentQuestions() {
    const unanswered = [];
    const questions = document.querySelectorAll('#student-survey-content .question');
    
    questions.forEach((question, index) => {
        const questionText = question.querySelector('p');
        const questionTitle = questionText ? questionText.textContent.substring(0, 30) + '...' : '第' + (index + 1) + '题';
        
        // 检查单选按钮
        const radioInputs = question.querySelectorAll('input[type="radio"]');
        if (radioInputs.length > 0) {
            const name = radioInputs[0].name;
            const isAnswered = Array.from(radioInputs).some(input => input.checked);
            if (!isAnswered) {
                unanswered.push(questionTitle);
            }
        }
        
        // 检查复选框（只有第6题是复选框）
        const checkboxInputs = question.querySelectorAll('input[type="checkbox"]');
        if (checkboxInputs.length > 0) {
            const isAnswered = Array.from(checkboxInputs).some(input => input.checked);
            if (!isAnswered) {
                unanswered.push(questionTitle);
            }
        }
    });
    
    return unanswered;
}

// 显示加载提示模态框
function showLoadingModal() {
    const modal = document.getElementById('loading-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// 隐藏加载提示模态框
function hideLoadingModal() {
    const modal = document.getElementById('loading-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 显示学生测评的某个section
function showStudentSection(index) {
    // 隐藏所有sections
    studentSections.forEach(section => {
        document.getElementById(section).style.display = 'none';
    });
    
    // 显示当前section
    document.getElementById(studentSections[index]).style.display = 'block';
    
    // 更新进度条
    const progress = ((index + 1) / studentSections.length) * 100;
    document.getElementById('student-progress-bar').style.width = `${progress}%`;
    
    // 更新按钮状态
    document.getElementById('student-prev-btn').style.display = index > 0 ? 'block' : 'none';
    document.getElementById('student-next-btn').style.display = 'block';
    document.getElementById('student-submit-btn').style.display = 'none';
}

// 保存学生测评答案
function saveStudentAnswers(sectionIndex) {
    // 保存所有问题的答案
    const questions = document.querySelectorAll('#student-survey-content .question');
    
    questions.forEach((question, qIndex) => {
        // 处理单选按钮
        const radioInputs = question.querySelectorAll('input[type="radio"]');
        radioInputs.forEach(input => {
            if (input.checked) {
                const questionName = input.name;
                studentAnswers[questionName] = parseInt(input.value);
            }
        });
        
        // 处理复选框
        const checkboxInputs = question.querySelectorAll('input[type="checkbox"]');
        checkboxInputs.forEach(input => {
            if (input.checked) {
                const questionName = input.name;
                if (!studentAnswers[questionName]) {
                    studentAnswers[questionName] = [];
                }
                studentAnswers[questionName].push(input.value);
            }
        });
        
        // 处理文本输入
        const textInputs = question.querySelectorAll('input[type="text"]');
        textInputs.forEach(input => {
            const questionName = input.name;
            studentAnswers[questionName] = input.value;
        });
        
        // 处理文本域
        const textareaInputs = question.querySelectorAll('textarea');
        textareaInputs.forEach(input => {
            const questionName = input.name;
            studentAnswers[questionName] = input.value;
        });
    });
}

// 家长测评模块初始化
function initParentSurveyModule() {
    // 提交按钮点击事件（如果存在）
    const parentSubmitBtn = document.getElementById('parent-submit-btn');
    if (parentSubmitBtn) {
        parentSubmitBtn.addEventListener('click', function() {
            // 保存答案
            saveParentAnswers();
            
            // 分析结果
            analyzeParentResults();
        });
    }
}

// 保存家长测评答案
function saveParentAnswers() {
    const questions = document.querySelectorAll('#parent-survey-content .question');
    questions.forEach(question => {
        const radioInputs = question.querySelectorAll('input[type="radio"]');
        radioInputs.forEach(input => {
            if (input.checked) {
                const questionName = input.name;
                parentAnswers[questionName] = parseInt(input.value);
            }
        });
    });
}

// 显示加载提示
function showLoading(message = '正在分析，请稍候...') {
    // 创建加载提示元素
    let loadingElement = document.getElementById('ai-loading');
    if (!loadingElement) {
        loadingElement = document.createElement('div');
        loadingElement.id = 'ai-loading';
        loadingElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.9);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            font-family: Arial, sans-serif;
        `;
        document.body.appendChild(loadingElement);
    }
    
    // 设置加载提示内容
    loadingElement.innerHTML = `
        <div style="text-align: center;">
            <div style="width: 50px; height: 50px; border: 4px solid #f3f3f3; border-top: 4px solid #c8102e; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
            <p style="font-size: 16px; color: #333;">${message}</p>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    // 显示加载提示
    loadingElement.style.display = 'flex';
}

// 隐藏加载提示
function hideLoading() {
    const loadingElement = document.getElementById('ai-loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

// 显示错误提示
function showError(message = '分析失败，请稍后重试') {
    // 创建错误提示元素
    let errorElement = document.getElementById('ai-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = 'ai-error';
        errorElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            font-family: Arial, sans-serif;
        `;
        document.body.appendChild(errorElement);
    }
    
    // 设置错误提示内容
    errorElement.innerHTML = `
        <div style="text-align: center; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 400px;">
            <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
            <h3 style="color: #c8102e; margin-bottom: 15px;">分析失败</h3>
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">${message}</p>
            <button id="error-close-btn" style="
                background-color: #c8102e;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                font-size: 14px;
                cursor: pointer;
                transition: background-color 0.3s;
            ">确定</button>
        </div>
    `;
    
    // 显示错误提示
    errorElement.style.display = 'flex';
    
    // 添加关闭按钮事件
    setTimeout(() => {
        const closeBtn = document.getElementById('error-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                errorElement.style.display = 'none';
            });
        }
    }, 100);
}

// 使用AI分析问卷结果
async function analyzeWithAI(role, answers, scores, type) {
    // 显示加载提示
    showLoading('AI正在分析您的问卷结果，请稍候...');
    
    // API密钥（阿里云通义千问）
    const apiKey = 'sk-e5a5b570d93741aabcd155ef467037d2';
    // API端点（阿里云通义千问兼容模式）
    const apiEndpoint = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
    
    // 构建系统提示
    let systemPrompt = '';
    if (role === 'student') {
        systemPrompt = `你是一位温暖、专业的心理咨询师，擅长与儿童青少年沟通。请根据学生的问卷结果，用通俗易懂的语言，像朋友一样分享你的观察和建议。
请基于以下信息：
- 学生类型：${type}
- 问卷得分情况：总分${scores.total}
- 问卷答案：${JSON.stringify(answers)}

请生成一段温暖、人文的分析，包括：
1. 对学生心理状态和性格的理解
2. 真诚的肯定和鼓励
3. 简单实用的建议
4. 如何通过红色文化活动促进成长

请用一段话表达，语言自然流畅，不要使用专业术语和符号，就像面对面交流一样温暖。`;
    } else if (role === 'parent') {
        systemPrompt = `你是一位温暖、专业的家庭教育顾问，擅长理解家长的心声。请根据家长的问卷结果，用通俗易懂的语言，像朋友一样分享你的观察和建议。
请基于以下信息：
- 家长类型：${type}
- 问卷得分情况：总分${scores.total}
- 问卷答案：${JSON.stringify(answers)}

请生成一段温暖、人文的分析，包括：
1. 对家长教育方式的理解和肯定
2. 真诚的鼓励
3. 简单实用的亲子沟通建议
4. 如何通过红色家风活动促进家庭和谐

请用一段话表达，语言自然流畅，不要使用专业术语和符号，就像面对面交流一样温暖。`;
    }
    
    try {
        console.log('开始调用阿里云通义千问API（兼容模式）...');
        console.log('API端点:', apiEndpoint);
        console.log('请求参数:', {
            model: 'qwen-plus',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: '请分析这份问卷结果并提供专业建议。' }
            ]
        });
        
        // 调用阿里云通义千问API（兼容模式，使用类似OpenAI的格式）
        const response = await fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'qwen-plus', // 使用通义千问的plus模型
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: '请分析这份问卷结果并提供专业建议。' }
                ],
                max_tokens: 1000,
                temperature: 0.7
            })
        });
        
        console.log('API响应状态', response.status);
        console.log('API响应头', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('API错误详情:', errorData);
            throw new Error(`API请求失败: ${response.status} - ${errorData.error?.message || errorData.message || '未知错误'}`);
        }
        
        const data = await response.json();
        console.log('API响应数据:', data);
        
        // 处理兼容模式的响应格式（类似OpenAI）
        let aiContent = '';
        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
            aiContent = data.choices[0].message.content;
        } else if (data.output && data.output.text) {
            aiContent = data.output.text;
        } else if (data.result) {
            aiContent = data.result;
        } else {
            throw new Error('API响应格式错误，无法获取分析结果');
        }
        
        // 隐藏加载提示
        hideLoading();
        hideLoadingModal();
        return aiContent;
    } catch (error) {
        console.error('AI分析失败:', error);
        hideLoading();
        hideLoadingModal();
        
        // 生成详细的错误信息
        let errorMessage = 'AI分析失败，系统将使用默认分析结果。';
        if (error.message.includes('401')) {
            errorMessage = 'AI分析失败：API密钥无效或已过期。请检查您的API密钥是否正确。';
        } else if (error.message.includes('403')) {
            errorMessage = 'AI分析失败：API请求被拒绝。可能是API密钥权限不足或请求频率过高。';
        } else if (error.message.includes('429')) {
            errorMessage = 'AI分析失败：API请求频率过高。请稍后再试。';
        } else if (error.message.includes('500')) {
            errorMessage = 'AI分析失败：服务器内部错误。请稍后再试。';
        } else if (error.message.includes('NetworkError')) {
            errorMessage = 'AI分析失败：网络连接错误。请检查您的网络连接。';
        } else if (error.message.includes('CORS')) {
            errorMessage = 'AI分析失败：跨域资源共享(CORS)错误。请使用本地服务器运行项目。';
        }
        
        // 显示错误提示
        showError(errorMessage);
        
        // 返回默认分析结果
        if (role === 'student') {
            return '根据问卷结果，您的孩子整体心理健康状况良好。建议家长和老师继续关注孩子的情绪变化，鼓励孩子积极参与红色文化活动，培养孩子的自信心和社交能力。';
        } else {
            return '根据问卷结果，您的教育认知和行为整体良好。建议继续加强与孩子的沟通，积极参与红色文化活动，为孩子创造良好的家庭环境。';
        }
    }
}

// 分析学生测评结果
async function analyzeStudentResults() {
    // 计算总分
    let totalScore = 0;
    let aScore = 0; // 积极心理特质分
    let bScore = 0; // 特殊需求筛查分
    let cScore = 0; // 红色文化认同分
    
    for (let i = 1; i <= 11; i++) {
        const score = studentAnswers[`q${i}`] || 0;
        totalScore += score;
        
        if (i <= 4) {
            aScore += score;
        } else if (i <= 8) {
            bScore += score;
        } else {
            cScore += score;
        }
    }
    
    // 确定类型
    let studentType = '';
    let tags = '';
    let resourcePack = '';
    let resourcePackContent = {};
    let resourceType = '';
    
    // 根据分数判断学生类型
    if (aScore >= 15 && bScore <= 10 && cScore >= 12) {
        // 阳光开朗型：自信高、社交好、压力小
        studentType = '阳光开朗型';
        tags = '社交积极，情绪稳定';
        resourceType = 'student1';
    } else if (aScore < 10 && bScore <= 12) {
        // 内敛害羞型：内向敏感、社交被动
        studentType = '内敛害羞型';
        tags = '内心敏感，社交被动';
        resourceType = 'student2';
    } else if (bScore > 15 || (bScore > 12 && aScore < 10)) {
        // 孤独疏离型：社交隔离、情绪低落
        studentType = '孤独疏离型';
        tags = '社交隔离，情绪低落';
        resourceType = 'student3';
    } else if (cScore < 8 || (aScore >= 10 && aScore < 15 && bScore > 12)) {
        // 压力焦虑型：被期待压垮、自我否定
        studentType = '压力焦虑型';
        tags = '被期待压垮，自我否定';
        resourceType = 'student4';
    } else if (aScore >= 12 && aScore < 15 && bScore <= 10 && cScore >= 8) {
        // 乐观自愈型：自我调节、心态积极
        studentType = '乐观自愈型';
        tags = '自我调节，心态积极';
        resourceType = 'student5';
    } else {
        // 矛盾纠结型：情绪波动、自我认知摇摆
        studentType = '矛盾纠结型';
        tags = '情绪波动，自我认知摇摆';
        resourceType = 'student6';
    }
    
    // 获取资源包信息
    const resource = resourceData[resourceType];
    resourcePack = resource.name;
    resourcePackContent = {
        title: resource.name,
        items: resource.files,
        fileContents: resource.fileContents || {}
    };
    
    // 查找上传的对应资源包
    const uploadedResource = uploadedResources.find(r => r.type === resourceType);
    if (uploadedResource) {
        resourcePack = uploadedResource.name;
        resourcePackContent.title = uploadedResource.name;
        resourcePackContent.items = uploadedResource.files;
        resourcePackContent.fileContents = uploadedResource.fileContents || {};
    }
    
    // 使用AI分析结果
    const aiAnalysis = await analyzeWithAI('student', studentAnswers, {
        total: totalScore,
        aScore: aScore,
        bScore: bScore,
        cScore: cScore
    }, studentType);
    
    // 显示结果
    showResult({
        type: 'student',
        studentType: studentType,
        tags: tags,
        resourcePack: resourcePack,
        resourcePackContent: resourcePackContent,
        scores: {
            total: totalScore,
            aScore: aScore,
            bScore: bScore,
            cScore: cScore
        },
        aiAnalysis: aiAnalysis
    });
}

// 分析家长测评结果
async function analyzeParentResults() {
    // 计算总分
    let totalScore = 0;
    for (let i = 1; i <= 5; i++) {
        totalScore += parentAnswers[`pq${i}`] || 0;
    }
    
    // 确定类型
    let parentType = '';
    let resourcePack = '';
    let resourcePackContent = {};
    let resourceType = '';
    
    if (totalScore >= 20) {
        // 积极配合型
        parentType = '积极配合型';
        resourceType = 'parent1';
    } else if (totalScore >= 12) {
        // 认知不足型
        parentType = '认知不足型';
        resourceType = 'parent2';
    } else {
        // 特殊儿童家长型
        parentType = '特殊儿童家长型';
        resourceType = 'parent3';
    }
    
    // 获取资源包信息
    const resource = resourceData[resourceType];
    resourcePack = resource.name;
    resourcePackContent = {
        title: resource.name,
        items: resource.files
    };
    
    // 查找上传的对应资源包
    const uploadedResource = uploadedResources.find(r => r.type === resourceType);
    if (uploadedResource) {
        resourcePack = uploadedResource.name;
        resourcePackContent.title = uploadedResource.name;
        resourcePackContent.items = uploadedResource.files;
    }
    
    // 使用AI分析结果
    const aiAnalysis = await analyzeWithAI('parent', parentAnswers, {
        total: totalScore
    }, parentType);
    
    // 显示结果
    showResult({
        type: 'parent',
        parentType: parentType,
        resourcePack: resourcePack,
        resourcePackContent: resourcePackContent,
        scores: {
            total: totalScore
        },
        aiAnalysis: aiAnalysis
    });
}

// 结果模块初始化
function initResultModule() {
    // 查看资源包按钮点击事件（如果存在）
    const viewResourceBtn = document.getElementById('view-resource-btn');
    if (viewResourceBtn) {
        viewResourceBtn.addEventListener('click', function() {
            displayResourcePackContent();
            showModule('resource-module');
        });
    }
    
    // 退出登录按钮点击事件（如果存在）
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logout();
        });
    }
}

// 显示结果
function showResult(result) {
    const resultContent = document.getElementById('result-content');
    let html = '';
    
    if (result.type === 'student') {
        html = `
            <div class="result-item">
                <h3>测评结果</h3>
                <p><strong>类型：</strong>${result.studentType}</p>
                <p><strong>标签：</strong>${result.tags}</p>
                <p><strong>总分：</strong>${result.scores.total}</p>
                <p><strong>积极心理特质分：</strong>${result.scores.aScore}</p>
                <p><strong>特殊需求筛查分：</strong>${result.scores.bScore}</p>
                <p><strong>红色文化认同分：</strong>${result.scores.cScore}</p>
                <p><strong>推荐资源包：</strong>${result.resourcePack}</p>
                
                ${result.aiAnalysis ? `
                <div class="ai-analysis">
                    <h4>AI专业分析</h4>
                    <div class="ai-analysis-content">${result.aiAnalysis.replace(/\n/g, '<br>')}</div>
                </div>
                ` : ''}
            </div>
        `;
    } else if (result.type === 'parent') {
        html = `
            <div class="result-item">
                <h3>测评结果</h3>
                <p><strong>类型：</strong>${result.parentType}</p>
                <p><strong>总分：</strong>${result.scores.total}</p>
                <p><strong>推荐资源包：</strong>${result.resourcePack}</p>
                
                ${result.aiAnalysis ? `
                <div class="ai-analysis">
                    <h4>AI专业分析</h4>
                    <div class="ai-analysis-content">${result.aiAnalysis.replace(/\n/g, '<br>')}</div>
                </div>
                ` : ''}
            </div>
        `;
    }
    
    resultContent.innerHTML = html;
    
    // 保存资源包内容
    window.resourcePackContent = result.resourcePackContent;
    
    // 显示结果模块
    showModule('result-module');
}

// 老师模块初始化
function initTeacherModule() {
    // 菜单切换
    const menuBtns = document.querySelectorAll('#teacher-module .menu-btn');
    menuBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const menu = this.dataset.menu;
            
            // 切换菜单按钮状态
            menuBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 切换内容显示
            const contents = document.querySelectorAll('#teacher-module .menu-content');
            contents.forEach(content => content.classList.remove('active'));
            const targetContent = document.getElementById(menu);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    // 退出登录按钮点击事件（如果存在）
    const teacherLogoutBtn = document.getElementById('teacher-logout-btn');
    if (teacherLogoutBtn) {
        teacherLogoutBtn.addEventListener('click', function() {
            logout();
        });
    }
}

// 管理员模块初始化
function initAdminModule() {
    // 菜单切换
    const menuBtns = document.querySelectorAll('#admin-module .menu-btn');
    menuBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const menu = this.dataset.menu;
            
            // 切换菜单按钮状态
            menuBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 切换内容显示
            const contents = document.querySelectorAll('#admin-module .menu-content');
            contents.forEach(content => content.classList.remove('active'));
            const targetContent = document.getElementById(menu);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    // 退出登录按钮点击事件（如果存在）
    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', function() {
            logout();
        });
    }
    
    // 初始化资源列表
    updateResourceList();
}

// 资源包数据
let resourceData = {
    student1: {
        name: '阳光开朗型资源包：社交积极，情绪稳定',
        files: ['社交技巧指南', '情绪管理工具', '团队活动建议']
    },
    student2: {
        name: '内敛害羞型资源包：内心敏感，社交被动',
        files: ['自我表达练习', '社交自信培养', '情绪识别工具']
    },
    student3: {
        name: '孤独疏离型资源包：社交隔离，情绪低落',
        files: ['社交融入指南', '情绪支持工具', '亲子沟通建议']
    },
    student4: {
        name: '压力焦虑型资源包：被期待压垮，自我否定',
        files: ['压力管理技巧', '自我肯定练习', '亲子关系改善']
    },
    student5: {
        name: '乐观自愈型资源包：自我调节，心态积极',
        files: ['情绪调节工具', '目标设定指南', '自我激励技巧']
    },
    student6: {
        name: '矛盾纠结型资源包：情绪波动，自我认知摇摆',
        files: ['自我探索工具', '情绪稳定技巧', '决策辅助指南']
    }
};

// 更新资源列表
function updateResourceList() {
    const resourceList = document.getElementById('resource-list');
    
    // 清空现有列表
    resourceList.innerHTML = '';
    
    // 添加资源包
    Object.keys(resourceData).forEach(type => {
        const resource = resourceData[type];
        const resourceItem = document.createElement('div');
        resourceItem.className = 'resource-item';
        
        const h4 = document.createElement('h4');
        h4.textContent = resource.name;
        resourceItem.appendChild(h4);
        
        const p = document.createElement('p');
        p.textContent = `包含：${resource.files.join('、')}`;
        resourceItem.appendChild(p);
        
        const editBtn = document.createElement('button');
        editBtn.className = 'btn-sm';
        editBtn.textContent = '编辑';
        editBtn.addEventListener('click', function() {
            editResource(type);
        });
        resourceItem.appendChild(editBtn);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-sm';
        deleteBtn.textContent = '删除';
        deleteBtn.addEventListener('click', function() {
            deleteResource(type);
        });
        resourceItem.appendChild(deleteBtn);
        
        resourceList.appendChild(resourceItem);
    });
    
    // 添加上传的资源包
    uploadedResources.forEach((resource, index) => {
        const resourceItem = document.createElement('div');
        resourceItem.className = 'resource-item';
        
        const h4 = document.createElement('h4');
        h4.textContent = resource.name;
        resourceItem.appendChild(h4);
        
        const p1 = document.createElement('p');
        p1.textContent = `包含：${resource.files.join('、')}`;
        resourceItem.appendChild(p1);
        
        const p2 = document.createElement('p');
        p2.textContent = `上传时间：${resource.uploadTime}`;
        resourceItem.appendChild(p2);
        
        const editBtn = document.createElement('button');
        editBtn.className = 'btn-sm';
        editBtn.textContent = '编辑';
        editBtn.addEventListener('click', function() {
            editResource('uploaded', index);
        });
        resourceItem.appendChild(editBtn);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-sm';
        deleteBtn.textContent = '删除';
        deleteBtn.addEventListener('click', function() {
            deleteResource('uploaded', index);
        });
        resourceItem.appendChild(deleteBtn);
        
        resourceList.appendChild(resourceItem);
    });
}

// 编辑资源包
function editResource(type, index) {
    // 显示模态框
    const modal = document.getElementById('edit-modal');
    modal.style.display = 'block';
    
    // 保存资源类型和索引
    document.getElementById('edit-resource-type').value = type;
    document.getElementById('edit-resource-index').value = index || '';
    
    let resource;
    if (type === 'uploaded') {
        // 上传的资源包
        resource = uploadedResources[index];
    } else {
        // 默认资源包
        resource = resourceData[type];
    }
    
    // 填充表单
    document.getElementById('edit-resource-name').value = resource.name;
    
    // 显示当前文件列表
    const filesList = document.getElementById('current-files-list');
    filesList.innerHTML = '';
    
    if (resource.files && resource.files.length > 0) {
        resource.files.forEach((file, idx) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <span>${file}</span>
                <button onclick="removeFile(${idx})">删除</button>
            `;
            filesList.appendChild(fileItem);
        });
    } else {
        filesList.innerHTML = '<p>暂无文件</p>';
    }
    
    // 保存当前文件列表的引用
    window.currentEditingFiles = resource.files && Array.isArray(resource.files) ? [...resource.files] : [];
}

// 移除文件
function removeFile(index) {
    window.currentEditingFiles.splice(index, 1);
    
    // 更新文件列表显示
    const filesList = document.getElementById('current-files-list');
    filesList.innerHTML = '';
    
    if (window.currentEditingFiles.length > 0) {
        window.currentEditingFiles.forEach((file, idx) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <span>${file}</span>
                <button onclick="removeFile(${idx})">删除</button>
            `;
            filesList.appendChild(fileItem);
        });
    } else {
        filesList.innerHTML = '<p>暂无文件</p>';
    }
}

// 显示修改密码模态框
function showChangePasswordModal() {
    const modal = document.getElementById('change-password-modal');
    modal.style.display = 'block';
}

// 初始化编辑模态框
function initEditModal() {
    // 关闭按钮点击事件
    const editCloseBtn = document.querySelector('#edit-modal .close');
    if (editCloseBtn) {
        editCloseBtn.addEventListener('click', function() {
            document.getElementById('edit-modal').style.display = 'none';
        });
    }
    
    // 取消按钮点击事件
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function() {
            document.getElementById('edit-modal').style.display = 'none';
        });
    }
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('edit-modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // 保存按钮点击事件
    const saveResourceBtn = document.getElementById('save-resource-btn');
    if (saveResourceBtn) {
        saveResourceBtn.addEventListener('click', function() {
            const type = document.getElementById('edit-resource-type').value;
            const index = document.getElementById('edit-resource-index').value;
            const newName = document.getElementById('edit-resource-name').value;
            const fileInput = document.getElementById('edit-resource-files');
            
            let resource;
            if (type === 'uploaded') {
                // 上传的资源包
                resource = uploadedResources[index];
            } else {
                // 默认资源包
                resource = resourceData[type];
            }
            
            // 更新名称
            if (newName) {
                resource.name = newName;
            }
            
            // 处理文件上传
            const processFiles = () => {
                // 添加新上传的文件
                if (fileInput.files.length > 0) {
                    const filePromises = [];
                    
                    for (let i = 0; i < fileInput.files.length; i++) {
                        const file = fileInput.files[i];
                        filePromises.push(new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onload = function(e) {
                                const fileData = {
                                    name: file.name,
                                    content: e.target.result,
                                    type: file.type
                                };
                                resolve(fileData);
                            };
                            reader.onerror = function() {
                                // 如果读取失败，只存储文件名
                                const fileData = {
                                    name: file.name,
                                    content: null,
                                    type: file.type
                                };
                                resolve(fileData);
                            };
                            reader.readAsDataURL(file);
                        }));
                    }
                    
                    Promise.all(filePromises).then((fileDatas) => {
                        // 添加文件数据到当前编辑文件列表
                        fileDatas.forEach(fileData => {
                            window.currentEditingFiles.push(fileData.name);
                        });
                        
                        // 存储文件内容
                        if (!resource.fileContents) {
                            resource.fileContents = {};
                        }
                        
                        fileDatas.forEach(fileData => {
                            resource.fileContents[fileData.name] = fileData;
                        });
                        
                        // 完成后续操作
                        completeSave();
                    });
                } else {
                    // 没有新文件，直接完成
                    completeSave();
                }
            };
            
            // 完成保存操作
            const completeSave = () => {
                // 更新文件列表
                resource.files = window.currentEditingFiles;
                
                // 更新资源列表
                updateResourceList();
                
                // 关闭模态框
                document.getElementById('edit-modal').style.display = 'none';
                
                // 清空文件输入
                fileInput.value = '';
                
                alert('资源包已更新！');
            };
            
            // 开始处理文件
            processFiles();
        });
    }
}

// 初始化修改密码模态框
function initChangePasswordModal() {
    const modal = document.getElementById('change-password-modal');
    
    // 关闭按钮点击事件
    const closeBtn = document.querySelector('#change-password-modal .close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // 取消按钮点击事件
    const cancelBtn = document.getElementById('cancel-password-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // 保存按钮点击事件
    const saveBtn = document.getElementById('save-password-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // 验证当前密码
            if (currentPassword !== '19765525zs') {
                alert('当前密码错误！');
                return;
            }
            
            // 验证新密码
            if (newPassword.length < 6) {
                alert('新密码长度不能少于6位！');
                return;
            }
            
            // 验证确认密码
            if (newPassword !== confirmPassword) {
                alert('两次输入的新密码不一致！');
                return;
            }
            
            // 这里应该更新密码，现在只是模拟
            alert('密码修改成功！');
            
            // 关闭模态框
            modal.style.display = 'none';
            
            // 清空表单
            document.getElementById('current-password').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-password').value = '';
        });
    }
}

// 删除资源包
function deleteResource(type, index) {
    if (confirm('确定要删除这个资源包吗？')) {
        if (type === 'uploaded' && typeof index !== 'undefined') {
            // 删除上传的资源包
            uploadedResources.splice(index, 1);
        } else if (type && resourceData[type]) {
            // 重置默认资源包
            const defaultResourceData = {
                student1: {
                    name: '学生端资源包1：红色梦想·探索+协作',
                    files: ['红色故事', '红色实践任务', '视野拓展视频']
                },
                student2: {
                    name: '学生端资源包2：红色包容·坚韧+优势发现',
                    files: ['接纳差异故事', '微小成就任务', '一对一陪伴指南']
                },
                student3: {
                    name: '学生端资源包3：红色陪伴·归属感+情绪调节',
                    files: ['红色家书', '亲子陪伴任务', '情绪小技巧']
                },
                parent1: {
                    name: '家长端资源包1：红色家风·高效陪伴+家校联动',
                    files: ['家长培训教案', '亲子任务', '家校沟通模板']
                },
                parent2: {
                    name: '家长端资源包2：教育观念转变·正向激励+红色故事沟通法',
                    files: ['案例', '短视频', '简单话术']
                },
                parent3: {
                    name: '家长端资源包3：接纳差异·优势引导+家校档案',
                    files: ['个性化引导方案', '老师沟通指南', '心理支持']
                }
            };
            resourceData[type] = defaultResourceData[type];
        }
        updateResourceList();
        alert('资源包已删除！');
    }
}

// 资源包模块初始化
function initResourceModule() {
    // 返回按钮点击事件（如果存在）
    const resourceBackBtn = document.getElementById('resource-back-btn');
    if (resourceBackBtn) {
        resourceBackBtn.addEventListener('click', function() {
            showModule('result-module');
        });
    }
    
    // 显示资源包内容
    displayResourcePackContent();
    
    // 下载资源包内容（如果存在）
    const downloadResourceBtn = document.getElementById('download-resource-btn');
    if (downloadResourceBtn) {
        downloadResourceBtn.addEventListener('click', function() {
            if (window.resourcePackContent) {
                const content = JSON.stringify(window.resourcePackContent, null, 2);
                const blob = new Blob([content], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${window.resourcePackContent.title}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                alert('资源包下载成功！');
            } else {
                alert('暂无资源包内容');
            }
        });
    }
}

// 显示资源包内容
function displayResourcePackContent() {
    const resourceContent = document.getElementById('resource-content');
    if (!resourceContent) {
        return;
    }
    
    // 如果有 resourcePackContent，尝试找到对应的最新数据
    let currentResource = null;
    let safeItems = [];
    let safeFileContents = {};
    let title = '资源包';
    
    if (window.resourcePackContent && window.resourcePackContent.title) {
        title = window.resourcePackContent.title;
        
        // 在 resourceData 中查找
        for (const key in resourceData) {
            if (resourceData[key].name === title) {
                currentResource = resourceData[key];
                break;
            }
        }
        
        // 在 uploadedResources 中查找
        if (!currentResource) {
            for (const resource of uploadedResources) {
                if (resource.name === title) {
                    currentResource = resource;
                    break;
                }
            }
        }
        
        // 如果找到了，使用找到的数据
        if (currentResource) {
            safeItems = currentResource.files || [];
            safeFileContents = currentResource.fileContents || {};
        } else {
            // 使用 resourcePackContent 中的数据
            safeItems = window.resourcePackContent.items || [];
            safeFileContents = window.resourcePackContent.fileContents || {};
        }
    } else {
        // 没有 resourcePackContent，使用默认资源包数据
        const defaultResource = resourceData['student1'];
        title = defaultResource.name;
        safeItems = defaultResource.files || [];
        safeFileContents = defaultResource.fileContents || {};
    }
    
    let html = `<div class="resource-detail"><h3>${title}</h3>`;
    
    if (safeItems.length > 0) {
        html += '<ul class="resource-items-list">';
        safeItems.forEach((item, index) => {
            const fileData = safeFileContents[item];
            html += `<li class="resource-item-card">
                <div class="resource-item-header">
                    <span class="resource-item-name">${item}</span>
                </div>`;
            
            if (fileData && fileData.content) {
                // 有文件内容，显示预览/播放按钮
                if (fileData.type && fileData.type.startsWith('video/')) {
                    html += `<div class="resource-item-preview">
                        <video controls src="${fileData.content}" style="max-width: 100%; max-height: 300px;"></video>
                    </div>`;
                } else if (fileData.type && fileData.type.startsWith('audio/')) {
                    html += `<div class="resource-item-preview">
                        <audio controls src="${fileData.content}" style="width: 100%;"></audio>
                    </div>`;
                } else if (fileData.type && fileData.type.startsWith('image/')) {
                    html += `<div class="resource-item-preview">
                        <img src="${fileData.content}" alt="${item}" style="max-width: 100%; max-height: 200px;">
                    </div>`;
                } else if (fileData.type === 'application/pdf') {
                    html += `<div class="resource-item-preview">
                        <a href="${fileData.content}" target="_blank" class="btn-sm">查看PDF</a>
                    </div>`;
                } else {
                    // 文本或其他类型文件，显示内容
                    const contentPreview = fileData.content.length > 200 
                        ? fileData.content.substring(0, 200) + '...' 
                        : fileData.content;
                    html += `<div class="resource-item-preview">
                        <p style="white-space: pre-wrap;">${contentPreview}</p>
                    </div>`;
                }
                html += `<div class="resource-item-actions">
                    <button class="btn-sm" onclick="downloadResourceFile('${item}')">下载</button>
                </div>`;
            } else {
                // 没有文件内容，显示默认提示
                html += `<div class="resource-item-preview">
                    <p style="color: #666;">默认资源内容（未上传自定义文件）</p>
                </div>`;
            }
            
            html += '</li>';
        });
        html += '</ul>';
    } else {
        html += '<p>暂无资源内容</p>';
    }
    
    html += '</div>';
    resourceContent.innerHTML = html;
}

// 下载资源包中的单个文件
function downloadResourceFile(fileName) {
    if (window.resourcePackContent && window.resourcePackContent.fileContents && window.resourcePackContent.fileContents[fileName]) {
        const fileData = window.resourcePackContent.fileContents[fileName];
        if (fileData && fileData.content) {
            const link = document.createElement('a');
            link.href = fileData.content;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

// 显示模块
function showModule(moduleId) {
    // 隐藏所有模块
    const modules = document.querySelectorAll('.module');
    modules.forEach(module => {
        module.style.display = 'none';
    });
    
    // 显示指定模块
    document.getElementById(moduleId).style.display = 'block';
}

// 退出登录
function logout() {
    currentUser = null;
    currentRole = null;
    showModule('auth-module');
}

// 下载文件
function downloadFile(fileName, content, type) {
    if (content) {
        if (content.startsWith('data:')) {
            // 使用Data URL直接下载
            const link = document.createElement('a');
            link.href = content;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            // 创建文本文件下载
            const blob = new Blob([content], { type: type || 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    }
}