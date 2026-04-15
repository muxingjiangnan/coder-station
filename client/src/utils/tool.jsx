/**
 * 格式化时间戳
 * @param {*} timestamp 时间戳
 * @param {*} part 格式化部分
 * @returns 格式化后的时间字符串
 */
export function formatDate(timestamp, part) {
	if (!timestamp) {
		return;
	}

	/**
	 * 补全器(不足两位的数字前面补零)
	 * @param {*} num 处理的数字
	 * @returns 
	 */
	function _padZero(num) {
		return num < 10 ? '0' + num : num;
	}
	let date = new Date(parseInt(timestamp));

	let year = date.getFullYear(); // 年
	let month = _padZero(date.getMonth() + 1); // 月
	let day = _padZero(date.getDate()); // 日

	let hour = _padZero(date.getHours()); // 时
	let minutes = _padZero(date.getMinutes()); // 分
	let seconds = _padZero(date.getSeconds()); // 秒

	let weekArr = [
		"星期日",
		"星期一",
		"星期二",
		"星期三",
		"星期四",
		"星期五",
		"星期六",
	];
	let weekday = weekArr[date.getDay()];

	let result = "";

	switch (part) {
		case "year": {
			result = `${year}-${month}-${day}`;
			break;
		}
		case "time": {
			result = `${hour}:${minutes}:${seconds} `;
			break;
		}
		case "year-time": {
			result = `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
			break;
		}
		case "time-week": {
			result = `${hour}:${minutes}:${seconds} ${weekday}`;
			break;
		}
		default: {
			result = `${year}-${month}-${day} ${hour}:${minutes}:${seconds} ${weekday}`;
		}
	}

	return result;
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