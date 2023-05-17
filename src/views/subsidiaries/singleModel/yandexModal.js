import React, {Component} from "react";
import {Button, Modal} from "react-bootstrap";


export default class yandexModal extends Component {
    state = {
        coordinates: [],
        address: [],
        city_name: null,
    }
    map = null
    myPlacemark = null

    onYandexShow = () => {
        const filePathToJSScript = 'https://api-maps.yandex.ru/2.1.75/?apikey=33907888-8cda-4cba-9aff-70fef2bd758c&lang=ru_RU'
        let scripts = Array
            .from(document.querySelectorAll('script'))
            .map(scr => scr.src);
        if (!scripts.includes(filePathToJSScript)) {
            let scriptYandexMap = document.createElement('script')
            scriptYandexMap.setAttribute('src', filePathToJSScript)
            document.head.appendChild(scriptYandexMap)
            scriptYandexMap.addEventListener("load", this.initializeYandexMap)
        } else {
            this.initializeYandexMap()
        }
    }

    onHideModal = () => {
        this.props.onHide()
        this.myPlacemark = null
    }

    initializeYandexMap = () => {
        window.ymaps.ready(() => {
            const {coordinates} = this.props
            if (coordinates.length) {
                this.initMapState(coordinates)
            } else {
                this.initMapState([55.753215, 37.622504], true)
            }
        });
    }

    initMapState = (coords = [55.753215, 37.622504], mark_empty = false) => {
        console.warn(coords, 'initMapState')
        this.map = new window.ymaps.Map(`yandex-map-react`, {
            center: coords,
            zoom: 13,
            controls: ['fullscreenControl', 'zoomControl', 'geolocationControl'],
        })
        if (!mark_empty) {
            this.myPlacemark = this.createPlacemark(coords)
            this.myPlacemark.events.add('dragend', this.dragend)
            this.map.geoObjects.add(this.myPlacemark)
        }
        this.map.events.add("click", this.mapClick);
    }

    dragend = () => {
        const coords = this.myPlacemark.geometry.getCoordinates()
        this.setState({coordinates: coords})
        this.getAddress(coords)
    }

    getAddress = (coords) => {
        this.setState({coordinates: coords})
        this.myPlacemark.properties.set('iconCaption', 'поиск...');
        window.ymaps.geocode(coords).then((res) => {
            let firstGeoObject = res.geoObjects.get(0);
            let caption = [
                firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                firstGeoObject.getThoroughfare() || firstGeoObject.getPremise(), firstGeoObject.getPremiseNumber() || ''
            ].filter(Boolean).join(', ');
            this.setState({
                address: caption,
                city_name: [firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas()].filter(Boolean).join(', ')
            })
            this.myPlacemark.properties
                .set({
                    iconCaption: caption,
                    balloonContent: firstGeoObject.getAddressLine()
                });
        });
    }

    mapClick = (e) => {
        let coords = e.get('coords');
        if (this.myPlacemark) {
            this.myPlacemark.geometry.setCoordinates(coords);
        } else {
            this.myPlacemark = this.createPlacemark(coords)
            this.map.geoObjects.add(this.myPlacemark)
            this.myPlacemark.events.add('dragend', this.dragend)
        }
        this.getAddress(coords)
    }

    createPlacemark = (coords) => {
        const {address} = this.props
        return new window.ymaps.Placemark(coords, {
            iconCaption: address || 'Москва (по умолчанию)'
        }, {
            preset: 'islands#violetDotIconWithCaption',
            draggable: true
        });
    }

    callBack = () => {
        this.props.saveResult(this.state)
        this.myPlacemark = null
    }

    render() {
        return (
            <Modal
                show={this.props.show}
                onHide={this.onHideModal}
                onShow={this.onYandexShow}
                backdrop="static"
                keyboard={false}
                centered
                size="xl"
            >
                <Modal.Header closeButton onHide={this.onHideModal}>
                    <Modal.Title>Карта</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div id="yandex-map-react"></div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.onHideModal}>
                        Отмена
                    </Button>
                    <Button variant="primary"
                            onClick={this.callBack}>Сохранить</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}
