/**
 * 格式化时间戳
 * @param {*} timestamp
 * @returns
 */
export function formatDate(timestamp, part) {
	if (!timestamp) {
		return;
	}
	let date = new Date(parseInt(timestamp));

	let year = date.getFullYear(); // 年
	let month = date.getMonth() + 1; // 月
	let day = date.getDate(); // 日

	let hour = date.getHours(); // 时
	let minutes = date.getMinutes(); // 分
	let seconds = date.getSeconds(); // 秒

	let weekArr = [
		"星期日",
		"星期一",
		"星期二",
		"星期三",
		"星期四",
		"星期五",
		"星期六",
	];
	let week = weekArr[date.getDay()];

	// 需要给一位数前面加 0
	// 9 点 ----> 09:45:03

	if (month >= 1 && month <= 9) {
		// month += '0'; // a += b ----> a = a + b
		month = "0" + month;
	}

	if (day >= 0 && day <= 9) {
		day = "0" + day;
	}

	if (hour >= 0 && hour <= 9) {
		hour = "0" + hour;
	}

	if (minutes >= 0 && minutes <= 9) {
		minutes = "0" + minutes;
	}

	if (seconds >= 0 && seconds <= 9) {
		seconds = "0" + seconds;
	}

	var str = "";

	switch (part) {
		case "year": {
			str = `${year}-${month}-${day}`;
			break;
		}
		case "time": {
			str = `${hour}:${minutes}:${seconds} `;
			break;
		}
		case "year-time": {
			str = `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
			break;
		}
		case "time-week": {
			str = `${hour}:${minutes}:${seconds} ${week}`;
			break;
		}
		default: {
			str = `${year}-${month}-${day} ${hour}:${minutes}:${seconds} ${week}`;
		}
	}

	return str;
}

/**
 * 批量创建下拉列表的 option
 * @param {*} Option 要创建的 Option 组件
 * @param {*} typeList 类别集合
 * @returns
 */
export function typeOptionCreator(Select, typeList) {
	let optionContainer = [];
	for (let option of typeList) {
		optionContainer.push(
			<Select.Option value={option._id} key={option._id}>
				{option.typeName}
			</Select.Option>
		);
	}
	return optionContainer;
}

/**
 * 密码强度验证规则
 * 要求：至少包含大小写字母、数字和特殊字符，长度8-20位
 */
export const passwordValidator = {
    validator: (_, value) => {
        if (!value) return Promise.resolve();
        
        const errors = [];
        
        if (value.length < 8 || value.length > 20) {
            errors.push("密码长度必须在8-20位之间");
        }
        if (!/[a-z]/.test(value)) {
            errors.push("密码必须包含小写字母");
        }
        if (!/[A-Z]/.test(value)) {
            errors.push("密码必须包含大写字母");
        }
        if (!/\d/.test(value)) {
            errors.push("密码必须包含数字");
        }
        if (!/[^A-Za-z0-9]/.test(value)) {
            errors.push("密码必须包含特殊字符");
        }
        
        if (errors.length > 0) {
            return Promise.reject(errors.join("，"));
        }
        
        return Promise.resolve();
    }
};