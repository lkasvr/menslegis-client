import IconMultipleForwardRight from '@/components/icon/icon-multiple-forward-right';
import React from 'react'

const ResumePropositionsTable = () => {
    return (
        <div className="panel h-full w-full">
            <div className="mb-5 flex items-center justify-between">
                <h5 className="text-lg font-semibold dark:text-white-light">Top Selling Product</h5>
            </div>
            <div className="table-responsive">
                <table>
                    <thead>
                        <tr className="border-b-0">
                            <th className="ltr:rounded-l-md rtl:rounded-r-md">Product</th>
                            <th>Price</th>
                            <th>Discount</th>
                            <th>Sold</th>
                            <th className="ltr:rounded-r-md rtl:rounded-l-md">Source</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                            <td className="min-w-[150px] text-black dark:text-white">
                                <div className="flex">
                                    <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/product-headphones.jpg" alt="avatar" />
                                    <p className="whitespace-nowrap">
                                        Headphone
                                        <span className="block text-xs text-primary">Digital</span>
                                    </p>
                                </div>
                            </td>
                            <td>$168.09</td>
                            <td>$60.09</td>
                            <td>170</td>
                            <td>
                                <button type="button" className="flex items-center text-danger">
                                    <IconMultipleForwardRight className="ltr:mr-1 rtl:ml-1 rtl:rotate-180" />
                                    Direct
                                </button>
                            </td>
                        </tr>
                        <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                            <td className="text-black dark:text-white">
                                <div className="flex">
                                    <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/product-shoes.jpg" alt="avatar" />
                                    <p className="whitespace-nowrap">
                                        Shoes <span className="block text-xs text-warning">Faishon</span>
                                    </p>
                                </div>
                            </td>
                            <td>$126.04</td>
                            <td>$47.09</td>
                            <td>130</td>
                            <td>
                                <button type="button" className="flex items-center text-success">
                                    <IconMultipleForwardRight className="ltr:mr-1 rtl:ml-1 rtl:rotate-180" />
                                    Google
                                </button>
                            </td>
                        </tr>
                        <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                            <td className="text-black dark:text-white">
                                <div className="flex">
                                    <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/product-watch.jpg" alt="avatar" />
                                    <p className="whitespace-nowrap">
                                        Watch <span className="block text-xs text-danger">Accessories</span>
                                    </p>
                                </div>
                            </td>
                            <td>$56.07</td>
                            <td>$20.00</td>
                            <td>66</td>
                            <td>
                                <button type="button" className="flex items-center text-warning">
                                    <IconMultipleForwardRight className="ltr:mr-1 rtl:ml-1 rtl:rotate-180" />
                                    Ads
                                </button>
                            </td>
                        </tr>
                        <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                            <td className="text-black dark:text-white">
                                <div className="flex">
                                    <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/product-laptop.jpg" alt="avatar" />
                                    <p className="whitespace-nowrap">
                                        Laptop <span className="block text-xs text-primary">Digital</span>
                                    </p>
                                </div>
                            </td>
                            <td>$110.00</td>
                            <td>$33.00</td>
                            <td>35</td>
                            <td>
                                <button type="button" className="flex items-center text-secondary">
                                    <IconMultipleForwardRight className="ltr:mr-1 rtl:ml-1 rtl:rotate-180" />
                                    Email
                                </button>
                            </td>
                        </tr>
                        <tr className="group text-white-dark hover:text-black dark:hover:text-white-light/90">
                            <td className="text-black dark:text-white">
                                <div className="flex">
                                    <img className="h-8 w-8 rounded-md object-cover ltr:mr-3 rtl:ml-3" src="/assets/images/product-camera.jpg" alt="avatar" />
                                    <p className="whitespace-nowrap">
                                        Camera <span className="block text-xs text-primary">Digital</span>
                                    </p>
                                </div>
                            </td>
                            <td>$56.07</td>
                            <td>$26.04</td>
                            <td>30</td>
                            <td>
                                <button type="button" className="flex items-center text-primary">
                                    <IconMultipleForwardRight className="ltr:mr-1 rtl:ml-1 rtl:rotate-180" />
                                    Referral
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ResumePropositionsTable;
