import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getItems, addItem, deleteItem } from '../../actions/itemActions';

import { Button } from 'reactstrap';

import PropTypes from 'prop-types';

export class ShoppingList extends Component {
    componentDidMount() {
        this.props.getItems();
    }

    onDeleteClick = id => {
        console.log('deleted');
        this.props.deleteItem(id);
    };

    onAddClick = () => {
        const itemNumber = Math.floor(Math.random() * 100 + 1);
        this.props.addItem({
            name: `Item #${itemNumber}`
        });
    };

    render() {
        const { items } = this.props.item;

        const renderedItems = (
            <ul>
                {items.map((item, idx) => {
                    return (
                        <li key={idx}>
                            <Button onClick={() => this.onDeleteClick(item._id)}>X</Button>
                            {item.name}
                        </li>
                    );
                })}
            </ul>
        );
        return (
            <div>
                <Button onClick={this.onAddClick}>Add Item</Button>
                {renderedItems}
            </div>
        );
    }
}

ShoppingList.propTypes = {
    getItems: PropTypes.func.isRequired,
    addItem: PropTypes.func.isRequired,
    deleteItem: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    item: state.item
});
export default connect(mapStateToProps, { getItems, addItem, deleteItem })(ShoppingList);
