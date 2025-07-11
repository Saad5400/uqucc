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

    const maxLength = 45; // Maximum characters per line
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
            background-image: radial-gradient(circle, rgba(41, 130, 135, 0.5) 0%, rgba(5, 5, 5, 0.3) 50%, (5, 5, 5, 0) 70%);
        " />
    <div class="py-18 px-4 flex flex-col gap-4 items-end justify-start">
        <div class="flex gap-8">
            <img src="/favicon.svg" alt="Logo" class="w-16 h-16" />
            <h1 class="text-5xl font-bold m-0 whitespace-nowrap text-[#298287]">
                {{ reverseText(title) }}
            </h1>
        </div>

        <hr />
        <p v-for="line in reverseAndDivide(description)" class="text-4xl text-white/80 m-0 whitespace-nowrap">
            {{ line }}
        </p>
    </div>
</template>
