import { generateFromSnapshot, generateSnapshot } from '@sugarlabs/musicblocks-v4-lib';
import { ITreeSnapshot } from '@sugarlabs/musicblocks-v4-lib/@types/syntaxTree';
// import { ITreeSnapshot, ITreeSnapshotInput } from '@sugarlabs/musicblocks-v4-lib/@types/syntaxTree';

const saveProjectTemplate =
    '<!DOCTYPE html><html lang="en"><head> <meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="description" content="No description provided"> <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0"> <title>{{{Filename}}}</title> <meta property="og:site_name" content="Music Blocks"/> <meta property="og:type" content="website"/> <meta property="og:title" content="Music Blocks Project - {{{Filename}}}"/> <meta property="og:description" content="No description provided"/> <style>body{background-color: #dbf0fb;}#main{background-color: white; padding: 5%; position: fixed; width: 80vw; height: max-content; margin: auto; top: 0; left: 0; bottom: 0; right: 0; display: flex; flex-direction: column; justify-content: center; text-align: center; color: #424242; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23); font-family: "Roboto", "Helvetica", "Arial", sans-serif;}h3{font-weight: 400; font-size: 36px; margin-top: 10px;}hr{border-top: 0px solid #ccc; margin: 1em;}.btn{border: solid; border-color: #96D3F3; padding: 5px 10px; line-height: 50px; color: #0a3e58;}.btn:hover{transition: 0.4s; -webkit-transition: 0.3s; -moz-transition: 0.3s; background-color: #96D3F3;}.code{word-break: break-all; height: 15vh; background: #f6f8fa; color: #494949; text-align: justify; margin-right: 10vw; margin-left: 10vw; padding: 16px; overflow: auto; line-height: 1.45; background-color: #f6f8fa; border-radius: 3px; font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;}.image{border-radius: 2px 2px 0 0; position: relative; background-color: #96D3F3;}.image-div{margin-bottom: 10px;}.moreinfo-div{margin-top: 20px;}h4{font-weight: 500; font-size: 1.4em; margin-top: 10px; margin-bottom: 10px;}.tbcode{margin-bottom: 10px;}</style></head><body> <div id="main"> <div class="image-div"><img class="image" id="project-image" src=""></div><h3 id="title">Music Blocks Project - My Project</h3> <p>{{{Project Description}}}</p><hr> <div> <div style="color: #9E9E9E"> <p>This project was created in Music Blocks (<a href="https://musicblocks.sugarlabs.org" target="_blank">https://musicblocks.sugarlabs.org</a>). Music Blocks is a collection of tools for exploring fundamental musical concepts in a fun way. Music Blocks is a Free/Libre Software application. The source code can be accessed at <a href="https://github.com/sugarlabs/musicblocks-v4" target="_blank">https://github.com/sugarlabs/musicblocks-v4</a>. For more information, please consult the <a href="https://github.com/sugarlabs/musicblocks/tree/master/guide/README.md" target="_blank">Music Blocks Guide</a>.</p><p>To run this project, open Music Blocks in a web browser and drag and drop this file into the browser window. Alternatively, open the file in Music Blocks using the Load project button.</p></div><div class="moreinfo-div"> <div class="tbcode"> <h4>Project Code</h4>This code stores data about the blocks in a project. <a href="javascript:toggle();" id="showhide">Show</a> </div><div class="code">{{{Project snapshot}}}</div></div></div></div><script type="text/javascript">function toggle() { if (document.getElementsByClassName("code")[0].style.display == "none") { document.getElementsByClassName("code")[0].style.display = "flex"; document.getElementById("showhide").textContent = "Hide"; } else { document.getElementsByClassName("code")[0].style.display = "none"; document.getElementById("showhide").textContent = "Show"; } } var name = decodeURIComponent(window.location.pathname.split("/").pop().slice(0, -5)); var prefix = "Music Blocks Project - "; var title = prefix + name; document.querySelector(\'meta[property="og:title"]\').content = title; document.title = name; document.getElementById("title").textContent = title; document.getElementsByClassName("code")[0].style.display = "none";</script></body></html>';

/**
 * Exports the project snapshot encapsulated in a .html file.
 */
export function saveProjectHTML(): void {
    let textToSave = saveProjectTemplate;

    let fileName = prompt('Filename:', 'My Project');

    if (fileName != null) {
        fileName += '.html';

        let projectSnapshot = JSON.stringify(generateSnapshot());
        let projectDescription = prompt('Project Description:', 'Project Description');

        if (projectDescription != null) {
            textToSave = textToSave
                .replaceAll('{{{Filename}}}', fileName)
                .replace('{{{Project snapshot}}}', projectSnapshot)
                .replace('{{{Project Description}}}', projectDescription);
        } else {
            textToSave = textToSave
                .replaceAll('{{{Filename}}}', fileName)
                .replace('{{{Project snapshot}}}', projectSnapshot)
                .replace('{{{Project Description}}}', 'No Project Description');
        }

        let hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:attachment/text,' + encodeURIComponent(textToSave);
        hiddenElement.target = '_blank';
        hiddenElement.download = fileName;
        hiddenElement.click();
    }
}

export function loadProject(event: Event): void {
    const input = event.target;
    if ('files' in input! && input['files']['length'] == 1) {
        console.log(input['files'][0]);
        readFileContent(input['files'][0])
            .then((content) => {
                let temp2 = content as string;
                let position = temp2.indexOf('<div class="code">');
                let position2 = temp2.indexOf(
                    '</div></div></div></div><script type="text/javascript">',
                );
                let temp3 = temp2?.slice(position + 18, position2);
                let temp4 = JSON.parse(temp3);
                console.log(temp4);
                generateFromSnapshot(temp4 as ITreeSnapshot);
                console.log(generateSnapshot());
            })
            .catch((error) => console.log(error));
    }
}

function readFileContent(file: Blob): Promise<null | string | ArrayBuffer> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = (event) => resolve(event.target!.result);
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
}
