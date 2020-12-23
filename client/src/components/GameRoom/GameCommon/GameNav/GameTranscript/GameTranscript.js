import React, { Component } from 'react';
import classes from './GameTranscript.module.css';
import { Table } from 'reactstrap';

export class GameTranscript extends Component {
    changeTableScroll = () => {
        let objDiv = document.getElementById('transcript_body_id');
        objDiv.scrollTop = objDiv.scrollHeight;
    };

    componentDidUpdate() {
        this.changeTableScroll();
    }

    render() {
        const { transcript } = this.props;
        const renderedTranscriptMessages = getMessagesFromTranscript(transcript);
        return (
            <div>
                <Table borderless size="sm" className={classes.OuterTableContainer}>
                    <thead>
                        <tr>
                            <td>
                                <Table className={classes.TableHeader}>
                                    <thead>
                                        <tr>
                                            <th />
                                        </tr>
                                    </thead>
                                </Table>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div className={classes.TableBodyContainer} id="transcript_body_id">
                                    <Table className={classes.TableBody}>
                                        <tbody>{renderedTranscriptMessages}</tbody>
                                    </Table>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default GameTranscript;

const getMessagesFromTranscript = transcript => {
    if (!transcript) {
        return [];
    }

    const transcriptMessages = transcript.map((singleMessageText, idx) => (
        <tr key={idx}>
            <td>{singleMessageText}</td>
        </tr>
    ));

    return transcriptMessages;
};
