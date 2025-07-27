<script setup lang="ts">
const props = defineProps<{
    title: string;
    description: string;
}>();

function reverseAndDivide(text: string) {
    const lines = divideLines(text);
    return lines.map((line) => reverseText(line));
}

function reverseText(text: string) {
    // 小 : means little in Chinese
    // Can be replaced with any character that's not defined in your font
    return text.split(" ").reverse().join("小");
}

function divideLines(text: string) {
    if (text.includes('\n')) {
        return text.split('\n').map(line => line.trim());
    }

    const maxLength = 38; // Maximum characters per line
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";
    for (const word of words) {
        if ((currentLine + word).length > maxLength) {
            lines.push(currentLine.trim());
            currentLine = word + " ";
        } else {
            currentLine += word + " ";
        }
    }
    if (currentLine) {
        lines.push(currentLine.trim());
    }
    return lines;
}
</script>

<template>
    <div class="flex absolute top-0 left-[-100%]" style="
            width: 200%;
            height: 200%;
            background-image: radial-gradient(circle, rgba(41, 130, 135, 0.5) 0%, rgba(14, 46, 60, 0.3) 50%, (5, 5, 5, 0) 70%);
        " />
    <div class="flex flex-col items-end justify-start gap-4 px-4 py-18">
        <div class="flex items-center gap-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24"><g fill="none" stroke="#298287" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="#298287"><path d="M14 2h-4c-3.28 0-4.919 0-6.081.814a4.5 4.5 0 0 0-1.105 1.105C2 5.08 2 6.72 2 10s0 4.919.814 6.081a4.5 4.5 0 0 0 1.105 1.105C5.08 18 6.72 18 10 18h4c3.28 0 4.919 0 6.081-.814a4.5 4.5 0 0 0 1.105-1.105C22 14.92 22 13.28 22 10s0-4.919-.814-6.081a4.5 4.5 0 0 0-1.105-1.105C18.92 2 17.28 2 14 2"/><path d="m16 8l1.227 1.057c.515.445.773.667.773.943s-.258.498-.773.943L16 12M8 8L6.773 9.057C6.258 9.502 6 9.724 6 10s.258.498.773.943L8 12m5-5l-2 6m3.656 9l-.42-.419a3.1 3.1 0 0 1-.58-3.581M9 22l.42-.419A3.1 3.1 0 0 0 10 18m-3 4h10"/></g></svg>
            <h1 class="text-5xl font-bold m-0 whitespace-nowrap text-[#298287]">
                {{ reverseText(title) }}
            </h1>
        </div>

        <hr />
        <p v-for="line in reverseAndDivide(description)" class="m-0 text-5xl text-white/80 whitespace-nowrap">
            {{ line }}
        </p>
    </div>
</template>
