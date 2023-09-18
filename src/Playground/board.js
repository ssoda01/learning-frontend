import React, { useEffect, useRef, useState } from 'react';
import Layout from '@theme/Layout';
import './index.css'
/**
 * v0 by Vercel Labs.
 * @see https://v0.dev/t/aLUPWlh
 */

function Usage() {
    return (
        <div className='text-zinc-700 left-0 right-0 pt-2'>
            <a href='https://github.com/TakWolf/fusion-pixel-font'>
                Thanks @TakWolf/fusion-pixel-font
            </a>
        </div>
    )
}
export default function Playground() {
    const formRef = useRef()
    const [val, setVal] = useState('')
    const [randomLength, setRandomLength] = useState(10)
    useEffect(() => {
        console.log("form", formRef)
    }, [])
    const onChangeForm = () => {
        // @ts-ignore
        console.log("current ref:", formRef?.current.value)
        let originVal = formRef?.current.value
        setVal(scrambleText(originVal))

    }
    const textList = ['不想上班', '好想回家', '想逃']
    const randomChar = String.fromCharCode(Math.random() * (126 - 33) + 33); // 生成随机字符
    const preInput = () => {
        // 生成随机索引
        const randomIndex = Math.floor(Math.random() * textList.length);
        // 返回随机元素
        const randomElement = textList[randomIndex];
        formRef.current.value = randomElement
        setVal(scrambleText(randomElement))

        console.log(randomElement);  // 输出随机元素
    }
    const generateRandomChars = (n) => {
        if (typeof n != 'number') {
            n = 0
        }
        if (n < 0) {
            n = 0
        }
        let result = "";
        for (let i = 0; i < n; i++) {
            result += String.fromCharCode(Math.floor(Math.random() * (126 - 33 + 1)) + 33);
        }
        return result;
    }
    const changeRandom = (key) => {
        if (key === 'add') {
            console.log('click once')
            setRandomLength(randomLength + 1)
            onChangeForm()
        } else {
            if (randomLength - 1 >= 0) {
                setRandomLength(randomLength - 1)
                onChangeForm()
            }
        }
    }
    function scrambleText(text) {
        // 将每个字符分割成一个数组
        const chars = text.repeat(20).split('');
        // 遍历字符数组，将其中一半的字符用随机字符或字符串替换
        for (let i = 0; i < chars.length / 2; i++) {
        // for (let i = 0; i < chars.length / 2; i++) {
            chars[i] = chars[i] + generateRandomChars(randomLength);
        }
        // 在字符数组末尾添加一些随机字符或字符串以破坏字符排列
        for (let i = 0; i < 20; i++) {
            const randomChar = String.fromCharCode(Math.random() * (126 - 33) + 33); // 生成随机字符
            chars.push(randomChar);
        }
        // 将字符数组拼接成一个新的字符串并返回
        return chars.sort(() => Math.random() - 0.5).join('');
        // return chars.sort(() => Math.random() - 0.5).join('');
    }


    return (
        <div className='my-board bg h-screen p-8'>
            <div className='grid grid-cols-8 gap-4 pb-4'>
                <button className="bg-zinc-800 hover:bg-zinc-900 text-white font-semibold py-2 px-4 rounded-full shadow-md" onClick={() => preInput()}>开始尖叫</button>
                <button className="bg-zinc-800 hover:bg-zinc-900 text-white font-semibold py-2 px-4 rounded-full shadow-md" onClick={() => changeRandom("add")}>随机因子 +</button>
                <button className="bg-zinc-800 hover:bg-zinc-900 text-white font-semibold py-2 px-4 rounded-full shadow-md" onClick={() => changeRandom("minus")}>随机因子 -</button>
                <button className="bg-zinc-800 hover:bg-zinc-900 text-white font-semibold py-2 px-4 rounded-full shadow-md" onClick={() => changeRandom("minus")}>重复次数 +</button>
                <button className="bg-zinc-800 hover:bg-zinc-900 text-white font-semibold py-2 px-4 rounded-full shadow-md" onClick={() => changeRandom("minus")}>重复次数 -</button>
            </div>
            <div className='my-textbox overflow-scroll auto grid grid-cols-1 gap-4'>
                <textarea placeholder='Please type here' onChange={onChangeForm} ref={formRef} className="mytextarea animate-fade-in duration-500 bg-zinc-900 text-white placeholder-white border-zinc-500 border-0 rounded-lg py-2 px-3 leading-tight focus:outline-none focus:border-gray-600">
                </textarea>

                {/* <textarea className="appearance-none rounded-md bg-zinc-700" /> */}
                <div className="my-showbox animate-fade-in duration-500 rounded-md bg-zinc-900 mytextarea text-white placeholder-white border-zinc-500 border-0 py-2 px-3 leading-tight focus:outline-none focus:border-gray-600">
                    <div className='my-log gradient-text bg-transparent'>
                        {/* {randomLength}- */}
                        {val}
                        <span >&nbsp;</span>
                    </div>
                </div>
            </div>
            <Usage />
        </div >
    );
}