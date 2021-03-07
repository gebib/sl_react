import React, {useEffect, useRef, useState} from "react";
import "./ST_Blog.scss";
import {VerticalTimeline, VerticalTimelineElement} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import events from "./timeline/events.json";
import {FaBriefcase} from "react-icons/fa";
import largeSL_logo from "../../a2_logo_with_image/sl_logo_big.svg";
import {TextEditorWYSIWYG} from "../../a0_shared_all/wysiwyg/TextEditorWYSIWYG";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import {RiEditFill} from "react-icons/ri";
import {IconContext} from "react-icons";
import {FaShare} from "react-icons/fa";
import {MdClear} from "react-icons/md";
import {AiFillPicture} from "react-icons/ai";
import {ContentState, convertToRaw, EditorState} from "draft-js";
import draftToHtml from "draftjs-to-html";
import {useTranslation} from "react-i18next";
import {Editor} from "react-draft-wysiwyg";
import htmlToDraft from "html-to-draftjs";
import {Prompt} from "react-router-dom";
import {showToast} from "../../../UI_Main_pages_wrapper";


let blogDefaultTextE = `
<p>Share your inspirational article or blog with us!</p>
<p></p>
<p></p>
`;

let blogDefaultTextN = `
<p>Del din inspirerende artikkel eller blogg med oss!</p>
<p></p>
<p></p>
`;

export const UI_Blog = () => {
    const {t, i18n} = useTranslation("SL_languages");
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [rawAndHtmlForm, setRawAndHtmlForm] = useState([]);
    const [isBlogStatus, setIsBlogStatus] = useState(true);
    const [isArticleStatus, setIsArticleStatus] = useState(false);
    const [shouldPrompt, setShouldPrompt] = useState(false);
    const [listOfSelectedImg, setListOfSelectedImg] = useState(false);

    const [stagedFiles, setStagedFiles] = useState([]);

    const [user, setUser] = useState(null);


    const blogRef = useRef();
    const articleRef = useRef();
    const imgInputRef = useRef();

    useEffect(() => {
        setResetEditorState();
    }, [t]);

    const setResetEditorState = () => {
        let contentBlockBlog;
        if (i18n.language === "en") {
            contentBlockBlog = htmlToDraft(blogDefaultTextE);
        } else {
            contentBlockBlog = htmlToDraft(blogDefaultTextN);
        }
        if (contentBlockBlog) {
            const contentState = ContentState.createFromBlockArray(
                contentBlockBlog.contentBlocks
            );
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState);
        }
    };

    ///////////////temp/////////////
    const images = [
        {
            original: 'https://picsum.photos/id/1018/1000/600/',
            thumbnail: 'https://picsum.photos/id/1018/250/150/',
        },
        {
            original: 'https://picsum.photos/id/1015/1000/600/',
            thumbnail: 'https://picsum.photos/id/1015/250/150/',
        },
        {
            original: 'https://picsum.photos/id/1019/1000/600/',
            thumbnail: 'https://picsum.photos/id/1019/250/150/',
        },
    ];
    ///////////////temp/////////////


    const handleTimeelementClick = (e) => {
        console.log("////:OnCl ");
    };

    const postBlog = () => {
        let raw = convertToRaw(editorState.getCurrentContent());
        let htmlTxt = draftToHtml(convertToRaw(editorState.getCurrentContent()));

        setRawAndHtmlForm([raw, htmlTxt]);
        console.log("////:RAW: ", raw);
        console.log("////:htmlTxt: ", htmlTxt);

        localStorage.removeItem("tmpBlogState");
    };

    // on refresh etc, {should save to localstorage}, if not possible prompt user? is that possible
    // pictures should hvae remove button, after being stagged etc.constructor
    // upload.. progress must add too etc.
    //     button should be green, if is a valid enough to be posted etc.

    // const handleCb = () => {
    //     console.log("////:Handle_isBlogStatus? ", isBlogStatus);
    //
    // };
    //
    // useEffect(() => {
    //     handleCb();
    // }, [isBlogStatus]);

    // window.confirm(t("jform.resetok"))////////////////////
    const checkShouldPrompt = () => {
        if (isTextEditorDirty()) {
            let whatIsIt = (isBlogStatus) ? t("blog.isBlog") : t("blog.isArticle");
            showToast(t("blog.toPostYour") + " " + whatIsIt + " " + t("blog.signInPlease"));
        }
    };


    const isTextEditorDirty = () => {
        let editedFormLength = convertToRaw(editorState.getCurrentContent()).blocks.length;
        return (editedFormLength > 3) || (editedFormLength < 3) || (stagedFiles.length !== 0);
    };

    //check previous saved blog form data on ls
    useEffect(() => {
        let localDataBlogTxt = null;

        try {
            localDataBlogTxt = localStorage.getItem("tmpBlogState");
        } catch (e) {
            console.log("////:No local storage temp found!. ", e);
        }

        if (localDataBlogTxt) {
            let contentBlockBlog = htmlToDraft(JSON.parse(localDataBlogTxt));
            if (contentBlockBlog) {
                const contentState = ContentState.createFromBlockArray(
                    contentBlockBlog.contentBlocks
                );
                const editorState = EditorState.createWithContent(contentState);
                setEditorState(editorState);
            }
        }
    }, []);

    const clearBlogForm = () => {
        if (isTextEditorDirty()) {
            if (window.confirm(t("blog.youSure"))) {
                localStorage.removeItem("tmpBlogState");
                setResetEditorState();
                setStagedFiles([]);
            }
        }
    };

    const saveStuffToLocalStorage = (lsName, dataToSave) => {
        try {
            localStorage.setItem(lsName, JSON.stringify(dataToSave));
            setShouldPrompt(false);
        } catch (e) {
            console.log("////:Could not save temp data to localstorage! ", e);
            setShouldPrompt(true);
        }
    };

    return (
        <div className={"timeLineMainWrapper"}>
            <Prompt when={shouldPrompt} message={t("blog.youSureWantToLeave")}/>
            <div className={"large_sl_logo_container_blog"}>
                <img className={"large_logo_image_blog"} src={largeSL_logo} alt={"SILVERLINING logo large"}/>
            </div>
            {/*/////////blog editor///////////*/}
            <div className={"editorWrapper"}>
                <div className={"editorInnerWrapper"}><Editor
                    editorStyle={{backgroundColor: "#fdfdfd"}}
                    toolbarClassName="mainToolBarWrapper"
                    wrapperClassName="toolWrapper"
                    editorClassName="editor"
                    size="normal"
                    toolbar={{
                        options: ["inline", "textAlign", "blockType", "fontSize", "fontFamily", "list", "link", "colorPicker", "history", "emoji"],
                        // image: { uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: true } },
                        link: {inDropdown: false},
                        list: {inDropdown: false}
                    }}
                    editorState={editorState}
                    onEditorStateChange={(es) => {
                        setEditorState(es);
                        saveStuffToLocalStorage("tmpBlogState", draftToHtml(convertToRaw(es.getCurrentContent())));
                        checkShouldPrompt();
                    }}/>
                    <div className={"blogEditorFooter"}>
                        <div className={"blogPhotos"}>
                            {stagedFiles && stagedFiles.map(file => {
                                return (
                                    <div key={file.file.id}>
                                        <img style={{margin: "5px"}} alt={"what"} src={`${file.id}`} height={"70px"}/>
                                    </div>
                                );
                            })}
                        </div>


                        <div className={"blogTypeCb mx-2"}>
                            <div className="form-check">
                                <input className="form-check-input"
                                       ref={blogRef}
                                       checked={isBlogStatus}
                                       onChange={(e) => {
                                           // handleCb(!e.target.checked);
                                           setIsBlogStatus(true);
                                       }}
                                       type={"checkbox"}
                                       id={"bl"}/>
                                <label className="form-check-label" htmlFor="bl">
                                    {t("blog.blog")}
                                </label>
                            </div>
                            <div className={"form-check"}>
                                <input className={"form-check-input"}
                                       ref={articleRef}
                                       checked={!isBlogStatus}
                                       onChange={(e) => {
                                           // handleCb(!e.target.checked);
                                           setIsBlogStatus(false);
                                       }}
                                       type={"checkbox"}
                                       id={"ar"}/>
                                <label className="form-check-label" htmlFor="ar">
                                    {t("blog.article")}
                                </label>
                            </div>
                        </div>


                        <div className="btn-group" role="group" aria-label="Basic outlined example">
                            <button style={{border: "2px solid white", transition: "2s"}} onClick={() => {
                                postBlog();
                            }} type="button"
                                    className={isTextEditorDirty() ? "btn btn-success  my-4" : "btn btn-dark  my-4"}>
                                <IconContext.Provider value={{size: "1.5em"}}>
                                    <FaShare style={{color: "#ffffff", marginRight: "10px"}}/>
                                </IconContext.Provider>
                                {isBlogStatus ? t("blog.postBlog") : t("blog.postArticle")}
                            </button>

                            <button style={{border: "2px solid white"}} onClick={(event) => {
                                event.preventDefault();
                                imgInputRef.current.click();
                            }} type="button" className="btn btn-dark my-4">
                                <input type="file" hidden/>
                                <IconContext.Provider value={{size: "1.5em"}}>
                                    <AiFillPicture style={{color: "#ffffff", marginRight: "10px"}}/>
                                </IconContext.Provider>
                                {t("blog.addImage")}
                            </button>
                            <input
                                ref={imgInputRef}
                                type={"file"}
                                className={"d-none"}
                                multiple={true}
                                accept={"image/*"}
                                onChange={(e) => {
                                    const files = e.target.files;
                                    let convertedFiles = [];
                                    Object.keys(files).forEach(i => {
                                        let newFileName = files[i].name;
                                        let existsInState = false;
                                        for (let j = 0; j < stagedFiles.length; j++) {
                                            if (newFileName === stagedFiles[j].file.name) {
                                                existsInState = true;
                                                break;
                                            }
                                        }
                                        if (!existsInState) {
                                            convertedFiles = [...convertedFiles, {
                                                id: URL.createObjectURL(files[i]),
                                                file: files[i]
                                            }];
                                        }

                                    });
                                    let filesToBeStaged = [...stagedFiles, ...convertedFiles];
                                    if (filesToBeStaged.length > 0) {
                                        setStagedFiles(filesToBeStaged);
                                    }
                                }}/>


                            <button style={{border: "2px solid white"}} onClick={(event) => {
                                clearBlogForm();

                            }} type="button" className="btn btn-dark my-4">
                                <input type="file" hidden/>
                                <IconContext.Provider value={{size: "1.5em"}}>
                                    <MdClear style={{color: "#0D6EFD"}}/>
                                </IconContext.Provider>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/*//////////blog editor//////////*/}
            <VerticalTimeline className={"verticalTl"}>
                {events.map(event => (
                    <VerticalTimelineElement
                        onTimelineElementClick={(e) => {
                            handleTimeelementClick(e);
                        }}
                        className="vertical-timeline-element--work"
                        iconStyle={{
                            background: "rgb(33, 150, 143)",
                            color: "#ffffff",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                            // boxShadow: "0 0 0 4px #248C9D",
                        }}

                        contentArrowStyle={{borderRight: "7px solid  #d3412a"}}
                        date="2011 - present"
                        icon={<img
                            alt=""
                            className="blogImg"
                            src="https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"/>}>
                        <div className={"blogReadMoreText"}>
                            <h3 className="vertical-timeline-element-title">Creative
                                Director</h3>
                            <h4 className="vertical-timeline-element-subtitle">Miami, FL</h4>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores corporis impedit
                                nobis
                                omnis quam quasi vitae, voluptatem? Ad architecto doloremque earum est excepturi facere
                                fugiat fugit in ipsa ipsum nobis obcaecati quia quod rem repellendus tempore, tenetur
                                ullam
                                ut veniam voluptatem. Ab ducimus quaerat rem. Harum incidunt numquam possimus. Debitis.
                            </p></div>
                        <div className={"blogListFooterEmbedWrapper"}>
                            <ImageGallery
                                items={images}
                                showPlayButton={false}
                                showNav={false}
                            />
                        </div>
                    </VerticalTimelineElement>
                ))}
            </VerticalTimeline>
        </div>

    );
};