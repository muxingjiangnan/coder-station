import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTypeList } from "../redux/typeSlice";
import { Tag } from "antd";
import { updataIssueTypeById ,updataBookTypeById} from "../redux/typeSlice";

/**
 * 分类组件
 * @param {*} props
 * @returns
 */
function TypeSelect() {
	const dispatch = useDispatch();
	const { typeList } = useSelector((state) => state.type);
	const [tagContainer, setTagContainer] = useState([]);
	const colorArr = [
		"#108ee9",
		"#2db7f5",
		"#f50",
		"green",
		"#87d068",
		"blue",
		"red",
		"purple",
	];

	useEffect(() => {
		if (!typeList.length) {
			dispatch(getTypeList());
		}
		if (typeList.length) {
			const arr = [];
			arr.push(
				<Tag
					color="magenta"
					value="all"
					key="all"
					style={{ cursor: "pointer" }}
                    onClick={()=>{
                        changeType('all');
                    }}
                    >
					全部
				</Tag>
			);
			for (let i = 0; i < typeList.length; i++) {
				arr.push(
					<Tag
						color={colorArr[i % colorArr.length]}
						value={typeList[i]._id}
						key={typeList[i]._id}
						style={{ cursor: "pointer" }}
                        onClick={()=>{
                            changeType(typeList[i]._id);
                        }}
                    >{typeList[i].typeName}
					</Tag>
				);
			}
			setTagContainer(arr);
		}
	}, [typeList]);

    function changeType(typeId){
		// 更新仓库对应的 issueTypeId 或者 bookTypeId 
        // if(typeId==="all") {

        //     return;
        // }
        if(location.pathname==="/issues"){
			dispatch(updataIssueTypeById(typeId));
        }
        if(location.pathname==='/books'){
            dispatch(updataBookTypeById(typeId));
        }
    }


	return <div>{tagContainer}</div>;
}

export default TypeSelect;
