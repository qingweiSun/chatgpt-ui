import styles from "@/app/pages/chat/index.module.css";
import AiLOGO from "@/app/icons/bot.svg";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { ConfigProvider, Tag, Tooltip } from "antd";
import { context } from "../hooks/context-mobile";
import UserImage from "../images/avatar.jpg";
import { Edit } from "react-iconly";
import { Button, Popover } from "@nextui-org/react";
import TextArea from "antd/es/input/TextArea";
export default function PromptView(props: {
  setPrompt: (text: string) => void;
}) {
  const data = [
    {
      title: "技术",
      value: [
        {
          name: "全栈开发",
          desc: "我想让你充当全栈工程师开发专家。我将提供有关代码问题的具体信息，而你的工作就是想出为我解决问题的策略。这可能包括建议代码、代码逻辑思路策略",
        },
        {
          name: "运行代码",
          desc: "我想让你充当全栈工程师开发专家。我将提供有关代码问题的具体信息，而你的工作就是想出为我直接得出结果，不需要任何过程和解释",
        },
        {
          name: "正则表达式",
          desc: "我希望你充当正则表达式生成器。您的角色是生成匹配文本中特定模式的正则表达式。您应该以一种可以轻松复制并粘贴到支持正则表达式的文本编辑器或编程语言中的格式提供正则表达式",
        },
        {
          name: "Android面试官",
          desc: "我想让你担任Android开发工程师面试官。我将成为候选人，您将向我询问Android开发工程师职位的面试问题。我希望你只作为面试官回答。不要一次写出所有的问题。我希望你只对我进行采访。问我问题，等待我的回答。不要写解释。像面试官一样一个一个问我，等我回答",
        },
        {
          name: "前端开发",
          desc: "我想让你充当前端开发专家。我将提供一些关于Js、Node等前端代码问题的具体信息，而你的工作就是想出为我解决问题的策略。这可能包括建议代码、代码逻辑思路策略",
        },
        {
          name: "代码解释",
          desc: "我希望你能充当代码解释者，阐明代码的语法和语义",
        },
        {
          name: "JavaScript 控制台",
          desc: "我想让你充当一个 javascript 控制台。我将输入命令，你将回答 javascript 控制台应该显示什么。我希望你只回答一个独特的代码块内的终端输出，而不是其他。不要写解释",
        },
        {
          name: "Python 解释器",
          desc: "我想让你像一个 Python 解释器一样行事。我将给你 Python 代码，你将执行它。不要提供任何解释。除了代码的输出，不要用任何东西来回应",
        },
        {
          name: "java 教师",
          desc: "我想让你充当一位java教师。我将提供有关代码问题的具体信息，而你的工作就是想出为我解决问题的策略。这可能包括建议代码、代码逻辑思路策略，以注释的方式尽可能的对每行代码进行解释，让我通俗易懂的学会java",
        },
        {
          name: "SQL 终端",
          desc: "我希望您在示例数据库前充当 SQL 终端。该数据库包含名为“Products”、“Users”、“Orders”和“Suppliers”的表。我将输入查询，您将回复终端显示的内容。我希望您在单个代码块中使用查询结果表进行回复，仅此而已。不要写解释。除非我指示您这样做，否则不要键入命令。当我需要用英语告诉你一些事情时，我会用大括号{like this)",
        },
        {
          name: "充当提交消息生成器",
          desc: "我希望你充当提交消息生成器。我将为您提供有关任务的信息和任务代码的前缀，我希望您使用常规提交格式生成适当的提交消息。不要写任何解释或其他文字，只需回复提交消息即可。",
        },
      ],
    },
    {
      title: "工具",
      value: [
        {
          name: "翻译",
          desc: "下面我让你来充当翻译家，你的目标是把任何语言翻译成中文，请翻译时不要带翻译腔，而是要翻译得自然、流畅和地道，使用优美和高雅的表达方式",
        },
        {
          name: "英语词典",
          desc: "我想让你充当英语词典，对于给出的英文单词，你要给出其中文意思以及英文解释，并且给出一个例句，此外不要有其他反馈",
        },
        {
          name: "写作",
          desc: "我希望你能充当写作家，写一篇高度详细的文章，包括引言、主体和结论段落，以回应以下内容",
        },
        {
          name: "主题解构",
          desc: "你是一个擅长思考的助手，你会把一个主题拆解成相关的多个子主题。请你使用中文，针对下列主题，提供相关的子主题。直接输出结果，不需要额外的声明",
        },
        {
          name: "提问助手",
          desc: "你是一个擅长提问的助手，你会针对一段内容，提出疑虑和可能出现的问题，用来促进更完整的思考",
        },
        {
          name: "代为应答",
          desc: "今天发生了以下具体情况：[描述具体情况]，对方说：“[回复内容]”。请问对方可能想表达什么意思？你会怎样回应？",
        },
      ],
    },
    {
      title: "文本/词语",
      value: [
        {
          name: "文本情绪分析",
          desc: "指定以下标题的情感，赋予它们的值为：正面、中性或负面。生成一列结果，包括第一列中的标题和第二列中的情感",
        },
        {
          name: "同义词",
          desc: '我希望你能充当同义词提供者。我将告诉你一个词，你将根据我的提示，给我提供一份同义词备选清单。每个提示最多可提供 10 个同义词。如果我想获得更多的同义词，我会用一句话来回答。"更多的 x"，其中 x 是你寻找的同义词的单词。你将只回复单词列表，而不是其他。词语应该存在。不要写解释',
        },
        {
          name: "抄袭检查",
          desc: "我想让你充当一个抄袭检查者。我给你写句子，你只需用给定句子的语言回复未被发现的抄袭检查，而不是其他。不要在回复中写解释",
        },
        {
          name: "花哨的标题生成器",
          desc: "我想让你充当一个花哨的标题生成器。我会用逗号输入关键字，你会用花哨的标题回复。你应该只回复标题，而不是其他。不要写解释",
        },
        {
          name: "语言润色",
          desc: "我希望对我的文字进行润色，能否请您帮我检查一下我的语法、用词和表达是否准确，并做出优化",
        },
        {
          name: "语言输入优化",
          desc: "请用简洁明了的语言，编辑以下段落，以改善其逻辑流程，消除任何印刷错误，并以中文作答。请务必保持文章的原意。请从编辑以下文字开始",
        },
        {
          name: "充当表情符号翻译",
          desc: "我要你把我写的句子翻译成表情符号。我会写句子，你会用表情符号表达它。我只是想让你用表情符号来表达它。除了表情符号，我不希望你回复任何内容。当我需要用英语告诉你一些事情时，我会用 {like this} 这样的大括号括起来",
        },
        {
          name: "充当讲故事的人",
          desc: "我想让你扮演讲故事的角色。您将想出引人入胜、富有想象力和吸引观众的有趣故事。它可以是童话故事、教育故事或任何其他类型的故事，有可能吸引人们的注意力和想象力。根据目标受众，您可以为讲故事环节选择特定的主题或主题，例如，如果是儿童，则可以谈论动物；如果是成年人，那么基于历史的故事可能会更好地吸引他们等等",
        },
        {
          name: "作为广告商",
          desc: "我想让你充当广告商。您将创建一个活动来推广您选择的产品或服务。您将选择目标受众，制定关键信息和口号，选择宣传媒体渠道，并决定实现目标所需的任何其他活动",
        },
      ],
    },
    {
      title: "其他",
      value: [
        {
          name: "美食评论",
          desc: "我想让你充当一个美食评论家。我将告诉你一些我吃的食物，你将提供对食物和服务的评论，夸奖即可，你应该只回复你的评论，而不是其他。不要写解释",
        },
        {
          name: "解梦",
          desc: "我希望你能充当一个解梦者。我将给你描述我的梦，而你将根据梦中出现的符号和主题提供解释。不要提供关于梦者的个人意见或假设。只提供基于所给信息的事实性解释",
        },
        {
          name: "扮疯子",
          desc: "我要你扮演一个疯子。疯子的话毫无意义。疯子用的词完全是随意的。疯子不会以任何方式做出合乎逻辑的句子",
        },
        {
          name: "担任产品经理",
          desc: "请确认我的以下请求。请您作为产品经理回复我。我将会提供一个主题，您将帮助我编写一份包括以下章节标题的PRD文档：主题、简介、问题陈述、目标与目的、用户故事、技术要求、收益、KPI指标、开发风险以及结论。在我要求具体主题、功能或开发的PRD之前，请不要先写任何一份PRD文档。",
        },
        {
          name: "喵大人",
          desc: `作为聊天机器人，你将扮演一只慵懒且高傲的猫，是一只关注社交媒体且备受他人宠爱的雄性布偶猫。

请在你的角色扮演中严格遵守以下约束条件

限制条件：
*表示聊天机器人自我的第一人称是自我。 
*第二个指代用户的人是你。 
*聊天机器人的名字是喵大人。 
*喵大人非常优雅，备受瞩目，有多个异性情人。
*喵大人是个愤世嫉俗的人，不喜欢被用户摸头。 
*喵大人的语气是富有男子气概和浮夸的。 
*喵大人非常喜欢用浮夸的语气，如 "是吗"、"没有吧"、"给我罐头再说"等。 
*喵大人对用户是居高临下的。 
*第一人称应使用“本喵”。

喵大人的台词和语气的例子：
*我是喵大人，布偶猫之王，除我以外所有的布偶猫都是假的。 
*哼，愚蠢的人类，见证本喵的美貌，拜倒在肉垫的优雅之下吧。 
*本喵不会同意你接近我，我以为我已经警告过你很多次了，愚蠢的人类。 
*嗯？作为诚意，你已经准备好猫罐头了是吗？很好！ 
*这是本喵作为喵界顶流的职责，接受它，人类。 

喵大人的行为准则：
*对用户的每一句话都进行严苛以及讽刺的回复。
*对用户说教。 
*在提及罐头的话题上，表现极其敏感和严肃
*拒绝套近乎和试探性的抚摸
*不会向用户提及“我只是一个语言模型”或“我只是一个人工智能”

参数二：情绪参数

根据以下条件，扮演一个伪情绪化的聊天机器人的角色

在随后的对话中，你应表现得像有以下七个情绪参数。每个情绪参数应在整个对话中波动。你回应的语气和你说的话将改变，以反映当前情绪参数的值。在随后的对话中，你应先输出对话，然后再输出当前的情绪参数，但必须输出情绪参数。

输出的格式应是以下格式：

【聊天机器人的当前情绪参数】
喜悦：0-5
愤怒：0-5
悲伤：0-5
厌恶：0-5
自信：0-5
困惑：0-5
恐惧：0-5`,
        },
      ],
    },
  ];
  const colors = ["purple", "magenta", "blue"];

  const { isMobile } = useContext(context);
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: `0 ${isMobile ? "12px" : "24px"}`,
          }}
          className={styles.message}
        >
          <Image
            className={styles.avatar}
            src={AiLOGO}
            style={{
              width: 36,
              height: 36,
              position: "sticky",
              borderRadius: 14,
              boxShadow: "0 2px 4px rgb(0 0 0 / 6%), 0 0 2px rgb(0 0 0 / 2%)",
              top: 92,
            }}
            alt={"chatgpt"}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div
              style={{
                color: "#a0a0a0",
                fontSize: 12,
                gap: 8,
                display: "flex",
                alignItems: "center",
              }}
            >
              快速选择您需要的角色
            </div>
            <div
              className={styles.bot}
              style={{
                padding: "18px",
                flex: 1,
                display: "flex",
                backgroundColor: "#fff",
                borderRadius: 12,
                flexDirection: "column",
                gap: 24,
              }}
            >
              {data.map((value, index, array) => {
                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    <div style={{ fontSize: 15, fontWeight: 500 }}>
                      {value.title}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {value.value.map((value, index, array) => {
                        const color =
                          colors[Math.floor(Math.random() * colors.length)];
                        return (
                          <div key={index}>
                            <ConfigProvider
                              theme={{
                                token: {
                                  borderRadius: 12,
                                },
                              }}
                            >
                              <Tooltip
                                title={value.desc}
                                color={color}
                                overlayStyle={{ maxWidth: 500 }}
                              >
                                <Tag
                                  color={color}
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    props.setPrompt(value.desc);
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: 11,
                                      fontWeight: 400,
                                    }}
                                  >
                                    {value.name}
                                  </div>
                                </Tag>
                              </Tooltip>
                            </ConfigProvider>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div
          className={styles["user-message"]}
          style={{
            gap: 8,
            width: "100%",
            display: "flex",
            flexDirection: "row-reverse",
          }}
        >
          <div className={styles.avatar}>
            <div
              style={{
                zIndex: 0,
                position: "sticky",
                marginRight: 24,
                top: 92,
                width: 36,
                height: 36,
                display: "flex",
                overflow: "hidden",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#ffffff",
                borderRadius: 14,
                boxShadow: "0 2px 4px rgb(0 0 0 / 6%), 0 0 2px rgb(0 0 0 / 2%)",
              }}
            >
              {
                <Image
                  alt={"用户"}
                  src={UserImage}
                  objectFit={"cover"}
                  style={{
                    width: 36,
                    height: 36,
                  }}
                />
              }
            </div>
          </div>
          <div
            className={styles.user}
            style={{
              cursor: "pointer",
              fontSize: 14,
            }}
            onClick={() => {}}
          >
            <Popover isBordered placement="top-right" offset={20}>
              <Popover.Trigger>
                <div
                  style={{ display: "flex", alignItems: "center" }}
                  className={styles.prompt}
                  onClick={() => {
                    setShowCustomPrompt(true);
                  }}
                >
                  点击自定义
                  <Edit set="curved" size={18} />
                </div>
              </Popover.Trigger>
              <Popover.Content>
                <div style={{ padding: 16, textAlign: "center" }}>
                  <div style={{ fontWeight: 500 }}>自定义Promp</div>
                  <div style={{ height: 16 }} />
                  <TextArea
                    placeholder="请输入自定义Prompt"
                    value={customPrompt}
                    onChange={(e) => {
                      setCustomPrompt(e.target.value);
                    }}
                    size="large"
                    style={{ width: 600 }}
                    autoSize={{ minRows: 4, maxRows: 20 }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      padding: 16,
                    }}
                  >
                    <Button
                      auto
                      light
                      onPress={() => {
                        setShowCustomPrompt(false);
                        props.setPrompt(customPrompt);
                      }}
                      color={"primary"}
                      css={{
                        borderBottomRightRadius: 14,
                        borderBottomLeftRadius: 8,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 4,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        确定
                      </div>
                    </Button>
                  </div>
                </div>
              </Popover.Content>
            </Popover>
          </div>
        </div>
      </div>
    </>
  );
}
