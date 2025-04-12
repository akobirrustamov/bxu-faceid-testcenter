import React from 'react';
import { CiLocationOn, CiPhone } from "react-icons/ci";
import { BsTelegram, BsInstagram } from "react-icons/bs";
import { FaYoutube, FaFacebook } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { useTranslation } from 'react-i18next';
import Zoom from "react-reveal/Zoom";

const Footer = () => {
    const { t } = useTranslation();

    return (
        <div className='bg-[#181D38] w-full pb-0 border-2 border-[#181D38]'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
                <div className='flex flex-wrap justify-between gap-8'>
                    {/* Address Block 1 */}
                    <Zoom>
                        <div className='flex-1 min-w-[250px] border-r border-white pr-4'>
                            <div className='flex items-center gap-2 mb-4'>
                                <CiLocationOn className='text-white text-2xl' />
                                <p className='text-white'>{t('footer.adress2')}</p>
                            </div>
                            <div className='flex items-center gap-2 mb-4'>
                                <CiPhone className='text-white text-2xl' />
                                <a className='text-white' href="tel:+998553099999">+998 55 309-99-99</a>
                            </div>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3064.8958577959097!2d64.42846967583635!3d39.80932777154381!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f5009003f1c477b%3A0x920d498788a13e58!2sBuxoro%20psixologiya%20va%20xorijiy%20tillar%20instituti!5e0!3m2!1sru!2s!4v1728054121217!5m2!1sru!2s"
                                width="100%"
                                height="200"
                                allowFullScreen=""
                                loading="lazy"
                                className='rounded-lg'
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </Zoom>

                    {/* Address Block 2 */}
                    <Zoom>
                        <div className='flex-1 min-w-[250px] border-r border-white pr-4'>
                            <div className='flex items-center gap-2 mb-4'>
                                <CiLocationOn className='text-white text-2xl' />
                                <p className='text-white'>{t('footer.adress1')}</p>
                            </div>
                            <div className='flex items-center gap-2 mb-4'>
                                <CiPhone className='text-white text-2xl' />
                                <a className='text-white' href="tel:+998553055555">+998 55 305-55-55</a>
                            </div>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19946.77748909167!2d64.50137016920861!3d39.80150096920902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f501b37c5f08b1d%3A0xf1d1690431b464ac!2sBuxoro%20psixologiya%20va%20xorijiy%20tillar%20instituti!5e0!3m2!1sru!2s!4v1728054406842!5m2!1sru!2s"
                                width="100%"
                                height="200"
                                allowFullScreen=""
                                loading="lazy"
                                className='rounded-lg'
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </Zoom>

                    {/* Social Media Links */}
                    <Zoom>
                        <div className='flex-1 min-w-[250px]'>
                            <p className='text-white text-lg mb-4'>Ijtimoiy sahifalar</p>
                            <a target="_blank" className='text-white no-underline flex items-center gap-2 mb-3' href="https://t.me/BuxPXTI_uz">
                                <BsTelegram className='text-white text-2xl' />
                                t.me/buxpxti_uz
                            </a>
                            <a target="_blank" className='text-white no-underline flex items-center gap-2 mb-3' href="https://www.instagram.com/buxpxti.uz/">
                                <BsInstagram className='text-white text-2xl' />
                                instagram.com/buxpxti.uz
                            </a>
                            <a target="_blank" className='text-white no-underline flex items-center gap-2 mb-3' href="https://youtube.com/@buxpxti">
                                <FaYoutube className='text-white text-2xl' />
                                youtube.com/@buxpxti
                            </a>
                            <a target="_blank" className='text-white no-underline flex items-center gap-2 mb-3' href="https://facebook.com/buxpxti.uz">
                                <FaFacebook className='text-white text-2xl' />
                                facebook.com/buxpxti.uz
                            </a>
                            <a target="_blank" className='text-white no-underline flex items-center gap-2 mb-3' href="mailto:buxpxti@gmail.com">
                                <MdOutlineEmail className='text-white text-2xl' />
                                buxpxti@gmail.com
                            </a>
                        </div>
                    </Zoom>
                </div>
            </div>

            {/* Copyright Section */}
            <p className='text-start h-full p-2 text-white'>{t('footer.copyright')}</p>
        </div>
    );
};

export default Footer;